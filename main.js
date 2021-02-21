/**
 * Class representing single block in blockchain
 * 
 * William Ikenna-Nwosu (wiknwo)
 */
const SHA256 = require('crypto-js/sha256');

class Block {
    /**
     * Constructor for single block in Blockchain
     * 
     * @param {*} index         Tells us where block sits on chain
     * @param {*} timestamp     Tells us when block was created
     * @param {*} data          Any type of data you want to associate with this block i.e. details of transaction for currency; how much was transferred, sender and receiver
     * @param {String} previousHash Contains has of block before this one. Very important and ensures integrity of blockchain
     */
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash() // This contains hash of block, need a way to calculate it
        this.nonce = 0; // Random value that has nothing to do with other values and can be changed to end up with hash with sufficient number of zeroes.
    }

    /**
     * Function to calculate hash for block by taking properties of
     * block and running them through a hash function and returning
     * a hash value to identify hash on blockchain.
     * 
     * Hash Function to be used: SHA-256
     */
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
        this.difficulty = 4
    }

    /**
     * Method creates first block in chain which must be added manually
     */
    createGenesisBlock(){
        return new Block(0, '01/01/2021', "Genesis block", '0000');
    }

    /**
     * Method returns the latest block in the chain
     */
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    /**
     * Method to add new block to chain
     * @param {Block} newBlock 
     */
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock); // In reality, you can't add a new block so easily as there are numerous checks in place
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

console.log('Mining block 1...');
willieCoin.addBlock(new Block(1, "03/09/2009", {amount : 4}))

console.log('Mining block 2...');
willieCoin.addBlock(new Block(2, "12/09/2021", {amount : 10}))

console.log('Mining block 3...');
willieCoin.addBlock(new Block(3, "13/09/2021", {amount : 450}))


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
 */