import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import useSWR from 'swr';
import { getAssets } from '../lib/chain';
import useContracts from './useContracts';

const useAssets = () => {
  const { provider, chainId } = useWeb3React();
  const contractMap = useContracts();

  const { data } = useSWR(
    provider ? `/assets?chainId=${chainId}` : null,
    () => getAssets(provider as ethers.providers.Web3Provider, contractMap),
    {
      revalidateOnFocus: false,
    }
  );

  return data;
};

export default useAssets;
