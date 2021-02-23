const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // This algo is basis of bitcoin wallets

/**
 * Need public and private key to (1) sign transactions and
 * (2) verify our balance i.e. money in our wallet
 */
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private key: ', privateKey);
console.log('Public key: ', publicKey);