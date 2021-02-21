/**
 * Class representing single block in blockchain
 * 
 * William Ikenna-Nwosu (wiknwo)
 */
const SHA256 = require('crypto-js/sha-256');

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
        this.chain = []; // Array to hold chain of blocks
    }

}