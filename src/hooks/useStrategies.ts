import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import useSWR from 'swr';
import { getStrategies } from '../lib/chain';

const useStrategies = () => {
  const { provider, chainId } = useWeb3React();

  const { data } = useSWR(
    provider ? `/strategies?chainId=${chainId}` : null,
    () => getStrategies(provider as ethers.providers.Web3Provider),
    {
      revalidateOnFocus: false,
    }
  );

  return data;
};

export default useStrategies;
