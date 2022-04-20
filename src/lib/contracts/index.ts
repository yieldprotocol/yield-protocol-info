import { Contract, ethers } from 'ethers';
import yieldEnv from '../../config/yieldEnv';
import { IContractMap } from '../../types/contracts';
import * as contracts from '../../contracts';
import { getABI } from '../../utils/etherscan';

export const getContracts = async (
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
  chainId: number
) => {
  /* Get the instances of the Base contracts */
  const addrs = yieldEnv.addresses[chainId];

  /* Update the baseContracts state */
  const newContractMap: IContractMap = {};

  [...Object.keys(addrs)].forEach((name: string) => {
    let contract: Contract | undefined;

    // try to connect directly to contract
    try {
      contract = contracts[`${name}__factory`].connect(addrs[name], provider);
    } catch (e) {
      console.log(`could not connect directly to contract ${name}`);
    }

    if (contract) newContractMap[name] = contract;
  });

  return newContractMap;
};

export const getContract = async (provider: ethers.providers.Web3Provider, chainId: number, name: string) => {
  const addrs = yieldEnv.addresses[chainId];

  // try to connect to contract via etherscan
  try {
    const abi = await getABI(chainId, addrs[name]);
    return new ethers.Contract(addrs[name], abi, provider);
  } catch (e) {
    console.log(`could not connect to contract ${name} via etherscan`);
    return undefined;
  }
};
