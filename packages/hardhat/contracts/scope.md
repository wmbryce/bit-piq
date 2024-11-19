I am creating a smart contract that allows users to bet on the last four bits of a block hash. 

The contract should allow a user to place a bet. A bet consists of a four bit hash, a block number that they are wagering on, and an amount of tickets they buying and the user that placed it.

Once the block number which has been chosen has been mined, the contract should check if the last four bits of the hash match the users bet. If they do, the user should be able to claim their winnings.
