//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows users to bet on the last 4 bits of a block hash
 * Users can place bets by specifying a 4-bit hash, block number, and amount of ETH
 * Once the target block is mined, users can claim winnings if their hash matches
 * @author BuidlGuidl
 */
contract BitPiqPool {
    // State Variables
    address public immutable owner;
    uint256 private cumAmountOfPendingBets;
    uint256 private nextBetId;

    struct Bet {
        uint8 hashPick; // 4-bit hash prediction (0-15)
        uint256 blockNumber; // Target block number
        uint256 ethAmount; // Amount of ETH in bet
    }

    mapping(address => mapping(uint256 => Bet)) public Bets;

    // Events
    event BetPlaced(
        address indexed bettor, uint256 indexed betId, uint8 hashPick, uint256 blockNumber, uint256 ethAmount
    );
    event BetEvaluated(uint256 indexed betId, bool winner);

    constructor() {
        owner = 0x629850841a6A3B34f9E4358956Fa3f5963f6bBC3;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    /**
     * @notice Places a bet on the last 4 bits of a future block hash
     * @param _hashPick uint8 - 4-bit number to bet on (0-15)
     */
    function placeBet(uint8 _hashPick) public payable {
        // Validate input
        require(_hashPick <= 15, "Hash pick must be 4 bits (0-15)");

        require(address(this).balance >= (msg.value * 16) + cumAmountOfPendingBets, "Insufficient amount in reserves");

        Bets[msg.sender][nextBetId] = Bet({hashPick: _hashPick, blockNumber: block.number, ethAmount: msg.value});

        emit BetPlaced(msg.sender, nextBetId, _hashPick, block.number, msg.value);
        nextBetId++;
    }

    /**
     * @notice Evaluates Bets for a user. Winning bets are payed out. All evaluated bets are removed from Bets mapping
     * @param _betIds uint256[10] - Fixed size array of betIds to evaluate
     */
    function evaluateBets(uint256[10] calldata _betIds) public {
        require(_betIds.length > 0, "Must supply betIds");

        for (uint8 i = 0; i < _betIds.length; i++) {
            Bet memory currentBet = Bets[msg.sender][_betIds[i]];

            bytes32 blockHashAtTimeOfBet = blockhash(currentBet.blockNumber);

            if (blockHashAtTimeOfBet == bytes32(0)) {
                continue;
            }

            uint8 lastFourBits = uint8(uint256(blockHashAtTimeOfBet) & 0xF);
            bool winner = false;

            if (lastFourBits == currentBet.hashPick) {
                winner = true;
                (bool success,) = payable(msg.sender).call{value: currentBet.ethAmount * 16}("Winnings Claimed");
                require(success, "Failed to send winnings");
            }

            emit BetEvaluated(_betIds[i], winner);
            delete Bets[msg.sender][_betIds[i]];
        }
    }

    /**
     * @notice Allows contributions to contract
     */
    function support() public payable {}

    /**
     * @notice Allows contract onwer to check the balance
     */
    function checkContractBalance() public view isOwner returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Allows contract onwer to check cumulative amount of pending bets
     */
    function checkCumAmountOfPendingBets() public view isOwner returns (uint256) {
        return cumAmountOfPendingBets;
    }

    /**
     * @notice Allows the contract owner to withdraw a specific amount of Ether.
     * @param _amount The amount to withdraw in wei.
     */
    function withdraw(uint256 _amount) public isOwner {
        // Check that the contract has enough balance
        require(address(this).balance - cumAmountOfPendingBets >= _amount, "Insufficient balance");

        console.log("Withdrawing:", _amount, "to:", msg.sender);

        // Perform the withdrawal
        (bool success,) = payable(msg.sender).call{value: _amount}("");
        require(success, "Withdrawal failed");
    }
}
