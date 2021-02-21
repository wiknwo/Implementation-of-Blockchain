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
    }

    /**
     * Function to calculate hash for block by taking properties of
     * block and running them through a hash function and returning
     * a hash value to identify hash on blockchain.
     * 
     * Hash Function to be used: SHA-256
     */
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
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
     * 
     * @param {Block} newBlock 
     */
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash(); // Every time we add a new block we need to calculate the hash
        this.chain.push(newBlock); // In reality, you can't add a new block so easily as there are numerous checks in place
    }
}

// Testing Blockchain
let willieCoin = new Blockchain();
willieCoin.addBlock(new Block(1, "10/09/2021", {amount : 4}))
willieCoin.addBlock(new Block(2, "12/09/2021", {amount : 10}))
willieCoin.addBlock(new Block(3, "13/09/2021", {amount : 450}))

console.log(JSON.stringify(willieCoin, null, 4));