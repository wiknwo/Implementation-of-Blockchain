import { Injectable } from '@angular/core';
import { Blockchain } from 'wiknwocoin/src/blockchain';
import ec from "elliptic";
@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance = new Blockchain();
  public walletKeys = [];

  constructor() { }
}
