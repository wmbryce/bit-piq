//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows users to bet on the last 4 bits of a block hash
 * Users can place bets by specifying a 4-bit hash, block number, and amount of tickets
 * Once the target block is mined, users can claim winnings if their hash matches
 * @author BuidlGuidl
 */
contract BitPiqPool {
    // State Variables
    address public immutable owner;
    uint256 public constant TICKET_PRICE = 1 wei;
    enum BetStatus { ACTIVE, CLAIMED, INACTIVE }
    
    struct Bet {
        uint8 hashPick;     // 4-bit hash prediction (0-15)
        uint256 blockNumber; // Target block number
        uint256 tickets;     // Number of tickets purchased
        BetStatus status;    // Whether the bet is still active
    }
    
    // Mapping of all active bets
    mapping(address => Bet[]) public bets;
    
    // Events
    event BetPlaced(address indexed bettor, uint8 hashPick, uint256 blockNumber, uint256 tickets);
    event WinningsTransferred(address indexed bettor, uint256 amount);
    
    constructor() {
        owner = 0x629850841a6A3B34f9E4358956Fa3f5963f6bBC3;
    }
    
    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }
    /**
     * Allows a person to contribute to the contract
     */
    function support() public payable returns (uint256) {
        return address(this).balance;
    }
    /**
     * Allows the owner to withdraw the contract balance
     */
    function withdraw() public isOwner {
        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        console.log("withdrawing:", address(this).balance, "to:", msg.sender);
        require(success, "Failed to send Ether");
    }
    
    /**
     * Places a bet on the last 4 bits of a future block hash
     * @param _hashPick uint8 - 4-bit number to bet on (0-15)
     * @param _tickets uint256 - Number of tickets to purchase
     */
    function placeBet(uint8 _hashPick, uint256 _tickets) public payable {
        // Validate inputs
        require(_hashPick <= 15, "Hash pick must be 4 bits (0-15)");
        require(_tickets > 0, "Must buy at least 1 ticket");
        require(msg.value == _tickets * TICKET_PRICE, "Incorrect ETH amount sent");
 
        uint256 _blockNumber = block.number;

        // Add logging
        console.log("Placing bet for address:", msg.sender);
        console.log("Current bets length:", bets[msg.sender].length);
        
        bets[msg.sender].push(Bet({
            hashPick: _hashPick,
            blockNumber: _blockNumber,
            tickets: _tickets,
            status: BetStatus.ACTIVE
        }));
        
        // Log after pushing
        console.log("New bets length:", bets[msg.sender].length);
        
        emit BetPlaced(msg.sender, _hashPick, _blockNumber, _tickets);
    }

    function getBetsForAddress(address _address) public view returns (Bet[] memory) {
        console.log("Number of bets:", bets[_address].length);
        return bets[_address];
    }

    /**
     * Claims winnings for a winning bet
     */
    function claimWinnings() public {
        // Search for unclaimed bets by the sender
        uint256 newWinnings = 0;

        for (uint256 i = 0; i < bets[msg.sender].length; i++) {
            // console.log("checking bet: status:", bets[msg.sender][i]);
            if (bets[msg.sender][i].status == BetStatus.ACTIVE) {
                bytes32 blockHash = blockhash(bets[msg.sender][i].blockNumber);
                if(blockHash == bytes32(0)){
                    continue;
                }
                uint8 lastFourBits = uint8(uint256(blockHash) & 0xF);
                console.log("checking bet: lastFourBits:", lastFourBits, "hashPick:", bets[msg.sender][i].hashPick);

                if(lastFourBits == bets[msg.sender][i].hashPick) {
                    newWinnings = bets[msg.sender][i].tickets * TICKET_PRICE * 15;
                    console.log("found a winning bet:", newWinnings);

                    require(address(this).balance >= newWinnings, "Insufficient contract balance");
                    console.log("sending:", newWinnings, ", to: ", msg.sender);
                    emit WinningsTransferred(msg.sender, newWinnings);
                    (bool success, ) = payable(msg.sender).call{value: newWinnings}("Winnings Claimed");
                    require(success, "Failed to send winnings");
                    bets[msg.sender][i].status = BetStatus.CLAIMED;
                } else {
                    bets[msg.sender][i].status = BetStatus.INACTIVE;
                }
            }
        }
    }
}
