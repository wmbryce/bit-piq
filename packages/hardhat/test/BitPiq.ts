import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractTransactionResponse } from "ethers";
import { ethers } from "hardhat";
import sinon from "sinon";
import { BitPiq } from "../typechain-types";

describe("BitPiq", () => {
  let contract: BitPiq & {
    deploymentTransaction(): ContractTransactionResponse;
  };
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const BitPiq = await ethers.getContractFactory("BitPiq");
    contract = await BitPiq.deploy();
    await contract.waitForDeployment();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Deployment", () => {
    it("should set the correct owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should initialize with 0 winningsReserve", async () => {
      const winningsReserve = await contract.winningsReserve();
      expect(winningsReserve).to.equal(0);
    });
  });

  describe("Support", () => {
    it("should accept Ether and update the contract balance", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("10") });

      const contractBalance = await ethers.provider.getBalance(contract.getAddress());

      expect(contractBalance).to.equal(ethers.parseEther("10"));
    });

    it("should allow multiple contributions", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("10") });
      await contract.connect(user2).support({ value: ethers.parseEther("2") });

      const contractBalance = await ethers.provider.getBalance(contract.getAddress());

      expect(contractBalance).to.equal(ethers.parseEther("12"));
    });
  });

  describe("placeBet", () => {
    it("should allow a user to place a valid bet", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("10") });

      const betAmount = ethers.parseEther("0.1");
      const placeBetResult = await contract.connect(user1).placeBet(7, { value: betAmount });

      const nextBetId = await contract.NextBetId(user1.address);
      expect(nextBetId).to.equal(1);

      const bets = await contract.getBets(user1.address);
      expect(bets.length).to.equal(1);
      expect(bets[0].hashPick).to.equal(7);
      expect(bets[0].ethAmount).to.equal(betAmount);
      expect(placeBetResult).to.emit(contract, "BetPlaced").withArgs(user1.address, 0, 7, betAmount, sinon.match.any);
    });

    it("should revert if the hashPick is invalid", async () => {
      await expect(contract.connect(user1).placeBet(16, { value: ethers.parseEther("0.1") })).to.be.revertedWith(
        "Hash pick must be 4 bits (0-15)",
      );
    });

    it("should revert if contract reserves are insufficient", async () => {
      await expect(contract.connect(user1).placeBet(7, { value: ethers.parseEther("100") })).to.be.revertedWith(
        "Insufficient amount in reserves",
      );
    });
  });

  describe("claimWinnings", () => {
    it("should guarantee a winning condition by placing bets for all hash picks (0-15)", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("200") });
      const betAmount = ethers.parseEther("0.1");

      const range = Array.from({ length: 16 }, (_, i) => i);

      for (const i of range) {
        await contract.connect(user1).placeBet(i, { value: betAmount });
      }

      await ethers.provider.send("evm_mine", []);
      await contract.connect(user1).claimWinnings(user1.address, range);

      const bets = await contract.getBets(user1.address);
      expect(bets.every(bet => bet.claimed)).to.be.true;
    });

    it("should revert if user does not exist", async () => {
      await expect(contract.connect(user1).claimWinnings(user2.address, [999])).to.be.revertedWith(
        "Input includes an invalid bet id!",
      );
    });

    it("should revert if any bet ID is invalid", async () => {
      await expect(contract.connect(user1).claimWinnings(user1.address, [999])).to.be.revertedWith(
        "Input includes an invalid bet id!",
      );
    });

    it("should revert if a bet is already claimed", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("20") });

      const betIds = [0];

      await contract.connect(user1).placeBet(7, { value: ethers.parseEther("0.1") });

      await contract.connect(user1).claimWinnings(user1.address, betIds);

      await expect(contract.connect(user1).claimWinnings(user1.address, betIds)).to.be.revertedWith(
        "Input includes an already claimed bet!",
      );
    });
  });

  describe("withdraw", () => {
    it("should allow the owner to withdraw funds", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("10") });
      const contractBalanceBefore = await ethers.provider.getBalance(contract.getAddress());
      expect(contractBalanceBefore).to.equal(ethers.parseEther("10"));

      await contract.connect(owner).withdraw(ethers.parseEther("0.5"));

      const contractBalanceAfter = await ethers.provider.getBalance(contract.getAddress());
      expect(contractBalanceAfter).to.equal(ethers.parseEther("9.5"));
    });

    it("should revert if non-owner tries to withdraw", async () => {
      await expect(contract.connect(user1).withdraw(ethers.parseEther("1"))).to.be.revertedWith("Not the Owner");
    });

    it("should revert if withdrawal amount exceeds available balance", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("0.1") });

      await expect(contract.connect(owner).withdraw(ethers.parseEther("1"))).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("getBets", () => {
    it("should return an empty array if user has no bets", async () => {
      const bets = await contract.getBets(user2.address);

      expect(bets.length).to.equal(0);
    });

    it("should return all bets for a user", async () => {
      await contract.connect(user1).support({ value: ethers.parseEther("10") });
      await contract.connect(user1).placeBet(3, { value: ethers.parseEther("0.1") });
      await contract.connect(user1).placeBet(7, { value: ethers.parseEther("0.2") });

      const bets = await contract.getBets(user1.address);

      expect(bets.length).to.equal(2);
      expect(bets[0].hashPick).to.equal(3);
      expect(bets[1].hashPick).to.equal(7);
    });
  });
});
