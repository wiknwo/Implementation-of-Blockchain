import { Injectable } from '@angular/core';
declare var require: any //
const {Blockchain, Transaction} = require('../../../../blockchain');
import EC from "elliptic";

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance = new Blockchain(); // Houses a copy of a blockchain
  public walletKeys = []; // Place to store wallet keys

  constructor() {
    this.blockchainInstance.difficulty = 1;
    this.blockchainInstance.minePendingTransactions('my-wallet-address');

    this.generateWalletKeys();
  }

  /**
   * Method responsible for returning the blockchain
   */
  getBlocks(){
    return this.blockchainInstance.chain;
  }

  /**
   * Method to add transaction to block
   * @param tx 
   */
  addTransaction(tx){
    this.blockchainInstance.addTransaction(tx);
  }

  /**
   * Method to get pending transactions
   */
  getPendingTransactions(){
    return this.blockchainInstance.pendingTransactions;
  }

  minePendingTransactions(){
    this.blockchainInstance.minePendingTransactions(
      this.walletKeys[0].publicKey
    )
  }

  /**
   * Method to generate wallet keys
   */
  private generateWalletKeys(){
    const ec = new EC.ec('secp256k1');
    const key = ec.genKeyPair();

    // Add key pair to walletkeys array. Wrap key in another object
    this.walletKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex'),
    });
  }
}
