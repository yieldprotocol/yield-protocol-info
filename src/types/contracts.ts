import { Contract } from 'ethers';

export interface IContractMap {
  [id: string]: IContract;
}

export interface IContract {
  contract: Contract;
  name: string;
}
