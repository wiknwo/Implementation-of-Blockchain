// Importing files into main
const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // This algo is basis of bitcoin wallets

const myKey = ec.keyFromPrivate('98ca8b11d7a6c0fa526bf556220f41e4f77a6f63ae96cc3658d34a0d278b160e');
const myWalletAddress = myKey.getPublic('hex');

// Testing Blockchain
let wiknwoCoin = new Blockchain();

// Creating and adding a transaction
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
wiknwoCoin.addTransaction(tx1);

// In reality, address1 and address2 would be the public key of someone's wallet.
// After creation of these transactions they will be pending transactions so we need a miner
console.log('\n Starting the miner...');
wiknwoCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of willie is', wiknwoCoin.getBalanceOfAddress(myWalletAddress));

wiknwoCoin.chain[1].transactions[0].amount = 1; // Chain not valid anymore because signature has changed.

console.log('Is chain valid?', wiknwoCoin.isChainValid());


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