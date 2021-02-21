
const SHA256 = require('crypto-js/sha256');

class Transaction {
    /**
     * Constructor to initialise transaction
     * @param {*} fromAddress Address of sender
     * @param {*} toAddress   Address of receiver
     * @param {*} amount      Amount being issued
     */
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

/**
 * Class representing single block in blockchain
 * 
 */
class Block {
    /**
     * Constructor for single block in Blockchain
     * 
     * @param {*} timestamp     Tells us when block was created
     * @param {*} transactions  Any type of data you want to associate with this block i.e. details of transaction for currency; how much was transferred, sender and receiver
     * @param {String} previousHash Contains has of block before this one. Very important and ensures integrity of blockchain
     * @param {*} nonce         Random value that has nothing to do with other values and can be changed to end up with hash with sufficient number of zeroes.
     */
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash() // This contains hash of block, need a way to calculate it
        this.nonce = 0; 
    }

    /**
     * Function to calculate hash for block by taking properties of
     * block and running them through a hash function and returning
     * a hash value to identify hash on blockchain.
     * 
     * Hash Function to be used: SHA-256
     */
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    /**
     * Inside this method, the aim is to make block hash
     * begin with a certain amount of zeroes.
     * @param {*} difficulty 
     */
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: ' + this.hash);
    }
}

/**
 * Class to represent blockchain
 */
class Blockchain {
    /**
     * Constructor responsible for initializing blockchain
     */
    constructor(){
        this.chain = [this.createGenesisBlock()]; // Array to hold chain of blocks
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.miningReward = 100; // If you successfully mine a new block
    }

    /**
     * Method creates first block in chain which must be added manually
     */
    createGenesisBlock(){
        return new Block('01/01/2021', "Genesis block", '0000');
    }

    /**
     * Method returns the latest block in the chain
     */
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    /**
     * Method to mine pending transactions.
     * Send a wallet address so reward can be issued upon
     * successful mining of block.
     * @param {*} miningRewardAddress 
     */
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions); // In real life, cannot add all pending transactions to a block as there are too many and block size cannot increase past 1MB. Miners have to pick transactions they want to include.
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block)

        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    /**
     * Method receives transaction and adds it to pending 
     * transactions array.
     * @param {*} transaction new transaction to be added to pendingTransactions array
     */
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    /**
     * Method to check balance at an address
     * Balance is actually stored on blockchain. If you want
     * to know it you must go through all transactions
     * that involve your address and calculate it that way.
     * 
     * @param {*} address Address to check balance at
     */
    getBalanceOfAddress(address){
        let balance = 0

        for(const block of this.chain){
            for(const transaction of block.transactions){
                // If you are from address, means you transferred money away from your wallet to someone else so we have to reduce your balance
                if(transaction.fromAddress === address){
                    balance -= transaction.amount;
                }

                //If you are toAddress then you are receiver and we have to increase your balance
                if(transaction.toAddress === address){
                    balance += transaction.amount
                }
            }
        }

        return balance;
    }

    /**
     * Method to check if chain is valid. Onece a block is added
     * to the chain, it cannot be changed without validating
     * rest of the chain. This method verifies integrity of
     * block chain.
     */
    isChainValid() {
        // Don't start with block 0 because that is the genesis block
        for(let i = 1;i < this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Check if hash of the block is still valid
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            // 2. Check if block checks to correct previous block
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

// Testing Blockchain
let willieCoin = new Blockchain();
willieCoin.createTransaction(new Transaction('address1', 'address2', 100))
willieCoin.createTransaction(new Transaction('address2', 'address1', 50))
// In reality, address1 and address2 would be the public key of someone's wallet.
// After creation of these transactions they will be pending transactions so we need a miner

console.log('\n Starting the miner...');
willieCoin.minePendingTransactions('willie\'s-balance');

console.log('\nBalance of willie is', willieCoin.getBalanceOfAddress('willie\'s-balance'));

console.log('\n Starting the miner again...');
willieCoin.minePendingTransactions('willie\'s-balance');

console.log('\nBalance of willie is', willieCoin.getBalanceOfAddress('willie\'s-balance'));



/**
 * END OF PART 1: CREATING A BLOCKCHAIN
 * 
 * Right now we can create new blocks very quickly, all we
 * hasve to do is create a transaction, compute its hash and 
 * add it to an array. Modern computers can do this very quickly
 * but we don't want people to create 100, 000s of blocks
 * and spam our blockchain. 
 * 
 * There is also a security issue. You can change the contents
 * of a block and simply recalculate the hashes for all blocks
 * after that and end up with a valid chain, even though 
 * you tampered with it. To solve these issues, blockchain has
 * this thing called proof of work (mining); proves you put
 * a lot of computing power into creating a block.
 * 
 * Blockchain requires the hash of a block to begin with
 * a certain amount of zeroes and because you can't 
 * influence the output of a hash function, you have
 * to hope you get lucky and end up with a hash with
 * suffiecient number of zeroes in front of it. This is
 * computationally intensive and is called difficulty.
 * Difficulty is set so there is a steady amount of
 * blocks being created. In bitcoin's case, that is one
 * block every 10 minutes. As computers increase in 
 * performance, they will take less time to create a new
 * block. To compensate for that, the difficulty will
 * simply be increased.
 **/

/**
 * END OF PART 2: PROOF OF WORK
 * 
 * Using this new difficulty method we can control how quickly
 * new blocks are added to the chain.
 * 
 * Next, turn blockchain into little cryptocurrency, we will make
 * it so that a (i) block can contain multiple transactions and
 * (ii) add rewards for miners.
 */

/**
 * END OF PART 3: CRYPTOCURRENCY
 * 
 * There is a small problem with current version. Anyone can make
 * any transaction that they want. To rectofy this, we must 
 * make it mandatory for people to sign off on transactions 
 * with a public and private key.
 */