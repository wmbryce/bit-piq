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

    enum BetStatus {
        ACTIVE,
        CLAIMED,
        INACTIVE
    }

    struct Bet {
        uint8 hashPick; // 4-bit hash prediction (0-15)
        uint256 blockNumber; // Target block number
        uint256 ethAmount; // Amount of ETH in bet
        BetStatus status; // Whether the bet is still active
    }

    // Mapping of all active bets
    mapping(address => Bet[10]) public Bets;

    // unique identifiers mapping
    mapping(address => mapping(uint256 => Bet)) public MoreBets;
    mapping(address => uint256) public nextBetId;

    // Events
    event BetPlaced(
        address indexed bettor, uint256 indexed betId, uint8 hashPick, uint256 blockNumber, uint256 ethAmount
    );
    event WinningsTransferred(address indexed bettor, uint256 amount);

    constructor() {
        owner = 0x629850841a6A3B34f9E4358956Fa3f5963f6bBC3;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    /**
     * @notice Allows contributions to contract
     */
    function support() public payable returns (uint256) {
        return address(this).balance;
    }

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

    /**
     * @notice Places a bet on the last 4 bits of a future block hash
     * @param _hashPick uint8 - 4-bit number to bet on (0-15)
     */
    function placeBet(uint8 _hashPick) public payable {
        // Validate input
        require(_hashPick <= 15, "Hash pick must be 4 bits (0-15)");

        uint256 _betAmount = msg.value;

        require(address(this).balance >= _betAmount + cumAmountOfPendingBets, "Insufficient amount in reserves");

        uint256 _blockNumber = block.number;

        // Add logging
        console.log("Placing bet for address:", msg.sender);
        console.log("Current bets length:", Bets[msg.sender].length);

        // todo: implement stack for fixed sized array of Bets
        // Bets[msg.sender].push(
        //     Bet({hashPick: _hashPick, blockNumber: _blockNumber, ethAmount: _betAmount, status: BetStatus.ACTIVE})
        // );

        // Log after pushing
        console.log("New Bets length:", Bets[msg.sender].length);

        emit BetPlaced(msg.sender, _hashPick, _blockNumber, _betAmount);
    }

    // function getBetsForAddress(address _address) public view returns (Bet[] memory) {
    //     console.log("Number of bets:", Bets[_address].length);
    //     return Bets[_address];
    // }

    // function getUserBets() public view returns (Bet[] memory) {
    //     return Bets[msg.sender];
    // }

    /**
     * Claims winnings for a winning bet
     */
    function claimWinnings() public {
        // Search for unclaimed Bets by the sender
        // uint256 newWinnings = 0;

        Bet[10] memory userBets = Bets[msg.sender];

        for (uint256 i = 0; i < userBets.length; i++) {
            Bet memory currentBet = userBets[i]; // get reference to actual Bet

            if (currentBet.status == BetStatus.ACTIVE) {
                bytes32 blockHashAtTimeOfBet = blockhash(currentBet.blockNumber);

                if (blockHashAtTimeOfBet == bytes32(0)) {
                    continue;
                }

                uint8 lastFourBits = uint8(uint256(blockHashAtTimeOfBet) & 0xF);
                console.log("checking bet: lastFourBits:", lastFourBits, "hashPick:", Bets[msg.sender][i].hashPick);

                if (lastFourBits == currentBet.hashPick) {
                    console.log("found a winning bet:", currentBet.ethAmount);
                    console.log("sending:", currentBet.ethAmount, ", to: ", msg.sender);

                    (bool success,) = payable(msg.sender).call{value: currentBet.ethAmount}("Winnings Claimed");
                    require(success, "Failed to send winnings");

                    emit WinningsTransferred(msg.sender, currentBet.ethAmount);
                }
                // todo: emit event, remove from array
            }
        }
    }
}
