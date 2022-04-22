import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import useSWR from 'swr';
import { getContracts } from '../lib/contracts';

const useContracts = () => {
  const { provider, chainId } = useWeb3React();

  const { data } = useSWR(
    provider ? `/contracts?chainId=${chainId}` : null,
    () => getContracts(provider as ethers.providers.Web3Provider, chainId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );
  return data;
};

export default useContracts;
