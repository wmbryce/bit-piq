import { expect } from "chai";
import { ethers } from "hardhat";

describe("BitPiqPool", () => {
  it("Deployment should set the owner", async function () {
    const hardhatToken = await ethers.deployContract("BitPiqPool");
    expect(await hardhatToken.owner()).to.equal("0x629850841a6A3B34f9E4358956Fa3f5963f6bBC3");
  });

  describe("support", () => {
    it("should add to the contract's balance and return it", async () => {
      const hardhatToken = await ethers.deployContract("BitPiqPool");

      let contractBalance = await ethers.provider.getBalance(hardhatToken);
      expect(contractBalance).to.equal(0);

      await hardhatToken.support({ value: ethers.parseEther("1") });

      contractBalance = await ethers.provider.getBalance(hardhatToken);
      expect(contractBalance.valueOf()).to.equal(ethers.parseEther("1"));

      await hardhatToken.support({ value: ethers.parseEther("1") });
      contractBalance = await ethers.provider.getBalance(hardhatToken);
      expect(contractBalance.valueOf()).to.equal(ethers.parseEther("2"));
    });
  });
});
