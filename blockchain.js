const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // This algo is basis of bitcoin wallets

class Transaction {
    /**
     * Constructor to initialise transaction
     * @param {*} fromAddress Address of sender
     * @param {*} toAddress   Address of receiver
     * @param {*} amount      Amount being issued
     */
    constructor(fromAddress, toAddress, amount, timestamp){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
		this.timestamp = timestamp;
    }

    /**
     * Method returns SHA256 hash of this transaction. It's
     * this hash that we are going to sign with our privatekey.
     * Just sign hash of transaction.
     */
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
    }

    /**
     * Method to sign transaction with public and private key.
     * Can only spend coins from wallet you have private key
     * for. And because private key is linked to pubic key,
     * that means that fromAddress in transaction must equal 
     * public key.
     * @param {*} signingKey Object received from elliptic library
     */
    signTransaction(signingKey) {
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    /**
     * This method verifies if transaction has been correctly 
     * signed. 
     */
    isValid() {
        // Mining reward address is null but transaction is
        // still valid
        if(this.fromAddress === null) {
            return true;
        }

        // If there is no signature or if signature is empty
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        // Verify transaction signed with correct key
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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

    /**
     * Method to verify all transactions in current block.
     * @returns boolean
     */
    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
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
        return new Block(Date.now(), [], '0');
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
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward, Date.now());
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash); // In real life, cannot add all pending transactions to a block as there are too many and block size cannot increase past 1MB. Miners have to pick transactions they want to include.
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block)

        this.pendingTransactions = [];
    }

    /**
     * Method receives transaction and adds it to pending 
     * transactions array.
     * @param {*} transaction new transaction to be added to pendingTransactions array
     */
    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address')
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain')
        }

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

            // Check if all transactions in current block
            // are valid
            if(!currentBlock.hasValidTransaction()){
                return false;
            }

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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;