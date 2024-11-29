//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

/**
 * A smart contract that allows users to bet on the last 4 bits of a block hash
 * Users can place bets by specifying a 4-bit hash, block number, and amount of ETH
 * Once the target block is mined, users can claim winnings if their hash matches
 */
contract BitPiq {
    address public immutable owner;
    uint256 public winningsReserve;

    struct Bet {
        uint8 hashPick;
        uint256 blockNumber;
        uint256 ethAmount;
        uint256 betId;
        bool claimed;
    }

    mapping(address => mapping(uint256 => Bet)) public Bets;
    mapping(address => uint256) public NextBetId;

    event BetPlaced(address indexed user, uint256 betId, uint8 hashPick, uint256 ethAmount, uint256 blockNumber);

    constructor() {
        owner = msg.sender;
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
        require(_hashPick <= 15, "Hash pick must be 4 bits (0-15)");
        require(address(this).balance >= (msg.value * 16) + winningsReserve, "Insufficient amount in reserves");

        uint256 nextBetId = NextBetId[msg.sender];

        Bets[msg.sender][nextBetId] = Bet({
            hashPick: _hashPick,
            blockNumber: block.number,
            ethAmount: msg.value,
            betId: nextBetId,
            claimed: false
        });

        emit BetPlaced(msg.sender, nextBetId, _hashPick, msg.value, block.number);

        NextBetId[msg.sender]++;
        winningsReserve += msg.value * 16;
    }

    /**
     * @notice Function for user to claim winnings for multiple bets
     * @param _address The user's address
     * @param _betIds Array of bet IDs to claim winnings for
     */
    function claimWinnings(address _address, uint256[] calldata _betIds) public {
        require(_betIds.length > 0, "_betIds array must not be empty!");

        uint256 totalWinnings = 0;

        for (uint256 i = 0; i < _betIds.length; i++) {
            uint256 betId = _betIds[i];
            Bet storage bet = Bets[_address][betId];

            require(bet.blockNumber != 0, "Input includes an invalid bet id!");
            require(!bet.claimed, "Input includes an already claimed bet!");

            bytes32 blockHashAtTimeOfBet = blockhash(bet.blockNumber);

            require(
                blockHashAtTimeOfBet != bytes32(0),
                "Input includes a bet whose winnings cannot be claimed because its block number has not been mined yet or the bet has expired!"
            );

            if (uint8(uint256(blockHashAtTimeOfBet) & 0xF) == bet.hashPick) {
                totalWinnings += bet.ethAmount * 16;
            }
            bet.claimed = true;
        }

        if (totalWinnings > 0) {
            (bool success,) = payable(_address).call{value: totalWinnings}("");
            require(success, "Failed to send winnings");
            winningsReserve -= totalWinnings;
        }
    }

    /**
     * @notice Get all Bets for an address
     */
    function getBets(address _address) public view returns (Bet[] memory) {
        uint256 nextBetId = NextBetId[_address];
        console.log("nextBetId", nextBetId);

        if (nextBetId == 0) {
            console.log("nextBetId is 0. Returning empty array");
            return new Bet[](0);
        }

        Bet[] memory userBets = new Bet[](nextBetId);

        for (uint256 i = 0; i < nextBetId; i++) {
            userBets[i] = Bets[_address][i];
        }

        return userBets;
    }

    /**
     * @notice Allows contributions to contract
     */
    function support() public payable {}

    /**
     * @notice Allows the contract owner to withdraw a specific amount of Ether.
     * @param _amount The amount to withdraw in wei.
     */
    function withdraw(uint256 _amount) public isOwner {
        require(address(this).balance - winningsReserve >= _amount, "Insufficient balance");

        (bool success,) = payable(msg.sender).call{value: _amount}("");
        require(success, "Withdrawal failed");
    }
}
