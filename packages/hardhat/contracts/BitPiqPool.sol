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
            // string prevBetId;
            // string nextBetId;
    }

    struct BetWithBetId {
        Bet bet;
        uint256 betId;
    }

    mapping(address => mapping(uint256 => Bet)) public Bets; // storage. fixed sized arrays
    // address -> betId -> Bet

    // Events
    event BetPlaced(
        address indexed bettor, uint256 indexed betId, uint8 hashPick, uint256 blockNumber, uint256 ethAmount
    );
    event BetEvaluated(uint256 indexed betId, bool winner);

    constructor() {
        owner = msg.sender;
        nextBetId = 1;
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

        emit BetPlaced(msg.sender, nextBetId, _hashPick, block.number, msg.value); // Use The Graph to read on-chain data
        nextBetId++;
        cumAmountOfPendingBets += msg.value * 16;
    }

    // user 123 makes bet with betId 1
    // user 456 mabes bet with betId 2
    // mapping  = {123: {1: {Bet}, 3: {Bet}}, 456: 2: {Bet}}
    // user 123 makes bet with betId 3

    /**
     * @notice Evaluates Bets for a user. Winning bets are payed out. All evaluated bets are removed from Bets mapping
     * @param _betIds uint256[10] - Fixed size array of betIds to evaluate
     */
    function evaluateBets(uint256[] calldata _betIds) public {
        // require(_betIds.length > 0, "Must supply betIds");

        for (uint8 i = 0; i < _betIds.length; i++) {
            Bet memory currentBet = Bets[msg.sender][_betIds[i]];
            // todo validate betIds exist for user
            // if (currentBet)
            console.log(currentBet.hashPick);

            bytes32 blockHashAtTimeOfBet = blockhash(currentBet.blockNumber);

            if (blockHashAtTimeOfBet == bytes32(0)) {
                console.log("block not mined yet");
                // this not yet mined or too far in the past 256 blocks. ie handle expired bets
                continue;
            }

            uint8 lastFourBits = uint8(uint256(blockHashAtTimeOfBet) & 0xF);
            bool winner = false;

            if (lastFourBits == currentBet.hashPick) {
                winner = true;
                (bool success,) = payable(msg.sender).call{value: currentBet.ethAmount * 16}("Winnings Claimed");
                console.log("winner", _betIds[i]);
                require(success, "Failed to send winnings");
            }

            emit BetEvaluated(_betIds[i], winner);
            delete Bets[msg.sender][_betIds[i]]; // idk gassyness of this operation
        }
    }

    function getPendingBets(address _address) public view returns (BetWithBetId[] memory) {
        uint256 count = 0;

        // First, count how many bets the user has
        for (uint256 i = 1; i < nextBetId; i++) {
            if (Bets[_address][i].ethAmount > 0) {
                count++;
            }
        }

        console.log("count", count);

        // Allocate memory for the result array
        BetWithBetId[] memory userBets = new BetWithBetId[](count);
        uint256 index = 0;

        // console.log("userBetsArray", userBets);

        // Populate the array
        for (uint256 i = 1; i < nextBetId; i++) {
            if (Bets[_address][i].ethAmount > 0) {
                userBets[index] = BetWithBetId({bet: Bets[_address][i], betId: i});
                // console.log(Bets[_address][i]);
                // console.log("Withdrawing:", _amount, "to:", _address);
                index++;
            }
        }

        return userBets;
    }

    /**
     * @notice Allows contributions to contract
     */
    function support() public payable {} // race condition with return

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
