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
contract BitPiqContract {
    // State Variables
    address public immutable owner;
    uint256 public constant TICKET_PRICE = 0.01 ether;
    
    struct Bet {
        uint8 hashPick;     // 4-bit hash prediction (0-15)
        uint256 blockNumber; // Target block number
        uint256 tickets;     // Number of tickets purchased
        address bettor;      // Address of person who placed bet
        bool claimed;        // Whether winnings have been claimed
    }
    
    // Mapping of all active bets
    Bet[] public bets;
    
    // Pool of all staked ether
    uint256 public pool = 1000;
    
    // Events
    event BetPlaced(address indexed bettor, uint8 hashPick, uint256 blockNumber, uint256 tickets);
    event WinningsClaimed(address indexed bettor, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }
    
    /**
     * Places a bet on the last 4 bits of a future block hash
     * @param _hashPick uint8 - 4-bit number to bet on (0-15)
     * @param _blockNumber uint256 - Future block number to bet on
     * @param _tickets uint256 - Number of tickets to purchase
     */
    function placeBet(uint8 _hashPick, uint256 _blockNumber, uint256 _tickets) public payable {
        // Validate inputs
        require(_hashPick <= 15, "Hash pick must be 4 bits (0-15)");
        require(_blockNumber > block.number, "Can only bet on future blocks");
        require(_tickets > 0, "Must buy at least 1 ticket");
        require(msg.value == _tickets * TICKET_PRICE, "Incorrect ETH amount sent");

        // Update pool
        pool += msg.value;
        
        // Create and store the bet
        bets.push(Bet({
            hashPick: _hashPick,
            blockNumber: _blockNumber,
            tickets: _tickets,
            bettor: msg.sender,
            claimed: false
        }));
        
        emit BetPlaced(msg.sender, _hashPick, _blockNumber, _tickets);
    }
    
    /**
     * Claims winnings for a winning bet
     * @param _betIndex uint256 - Index of bet in bets array
     */
    function claimWinnings(uint256 _betIndex) public {
        require(_betIndex < bets.length, "Invalid bet index");
        Bet storage bet = bets[_betIndex];
        
        require(msg.sender == bet.bettor, "Only bettor can claim");
        require(!bet.claimed, "Winnings already claimed");
        require(block.number > bet.blockNumber, "Target block not yet mined");
        
        // Get last 4 bits of target block hash
        bytes32 blockHash = blockhash(bet.blockNumber);
        require(blockHash != bytes32(0), "Block hash not available");
        
        uint8 lastFourBits = uint8(uint256(blockHash) & 0xF);
        
        require(lastFourBits == bet.hashPick, "Hash does not match prediction");
        
        // Mark as claimed
        bet.claimed = true;
        
        // Calculate and transfer winnings (2x tickets value)
        uint256 winnings = bet.tickets * TICKET_PRICE * 2;

        // Update pool
        pool -= winnings;
        (bool success, ) = bet.bettor.call{value: winnings}("");
        require(success, "Failed to send winnings");
        
        emit WinningsClaimed(bet.bettor, winnings);
    }
}
