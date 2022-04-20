import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import useSWR from 'swr';
import { getSeries } from '../lib/chain';
import useContracts from './useContracts';

const useSeries = () => {
  const { provider, chainId } = useWeb3React();
  const contractMap = useContracts();

  const { data } = useSWR(
    provider ? `/series?chainId=${chainId}` : null,
    () => getSeries(provider as ethers.providers.Web3Provider, contractMap),
    {
      revalidateOnFocus: false,
    }
  );

  return data;
};

export default useSeries;
