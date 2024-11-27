# Scope Document for BitPiq MVP

## Overview
BitPiq is a decentralized betting platform where users can wager on the last character of the next Bitcoin block hash. The platform prioritizes transparency, gas efficiency, and a user-friendly experience.

---

## Smart Contract Design

### Mappings
- **Mappings Structure**
  - `Address -> betId(uint256) -> Bet`
  - `Address -> nextBetId(uint256)`

- **Reasoning**
  - Gas-efficient design for adding, removing, and reading data compared to dynamic arrays.
  - Supports event-first architecture to determine bets ready for evaluation.
  - Limits computational work on-chain, offloading data aggregation and analytics to events and frontend.

### Events
- **Purpose**
  - Events are stored in transaction details and can be queried using tools like The Graph.
  - Key details: `blockNumber`, `betId`.
  - Helps the frontend determine if a block has been hashed before initiating costly evaluation operations.
  
- **Gas Saving Strategy**
  - Batch evaluation: Users submit multiple `betId`s for evaluation in a single transaction.
  - Incentivize batching by displaying saved gas costs.

---

### Contract Endpoints

#### **placeBet**
- Adds an entry to the `bets` mapping.
- Increments the `nextBetId` for the user.
- Emits an event with bet details.

#### **evaluateBets**
- Accepts an array of `betId`s for evaluation.
- Evaluates bets, transferring winnings to users.
- Deletes mapping entries upon processing.
- Emits events for frontend synchronization.

---

### Additional Considerations

#### Storage and Cost Analysis
- **Mapping Size**: Determine limits for mapping growth.
- **Historical Data**: Evaluate the cost-benefit of keeping bets in mappings versus relying solely on event logs for historical information.

#### Pending Bets Reserve
- Track cumulative pending bets to ensure sufficient reserves.
- Reserve management: Statistically, only 1/16th of the total bet pool may need to be held.

#### Expired Bets
- Determine policies for handling expired bets.

#### Revenue Model
- Commission on winnings (e.g., 1-3%).
- Evaluate user retention given net-negative returns in the long term.

---

## Frontend (FE) Application

### Features
1. **Bet Placement**
   - Support bets in hex or binary formats.
   - Accept ETH, Wei, or USD denominations.
2. **Data Display**
   - Recent blocks and bets with clear table headers.
3. **Admin Panel**
   - Features for balance checks, withdrawals, and support.
   - Address-based owner verification for routing admin functionalities.
4. **Support Button**
   - Accessible from the home page.

---

## MVP Requirements

### Smart Contract
- Properties
  - Bet struct and status.
- Endpoints
  - `placeBet`, `evaluateBet`, `updateBetStatus`.
  - `readBets(status)` (gasless if possible).
- Admin Functions
  - `support`, `withdraw`, `checkContractBalance`, `checkCumulativeAmountOfPendingBets`.

### Frontend
- Support bet placement and visualization.
- Enable administrative functionalities.

---

## Deployment and Next Steps

### Deployment
- Deploy to **Goerli Testnet**.
- Research wallet connection strategies for end-users.
- Deploy FE on **Vercel**.

### Improvements for Decentralization
- Host FE application on **IPFS** to achieve full decentralization.

---

## Enhancements and Future Work
- Evaluate and refine gas optimization strategies.
- Research long-term strategies for incentivizing user participation and ensuring platform sustainability.
