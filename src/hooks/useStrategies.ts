import { ethers } from 'ethers';
import useSWR from 'swr';
import { getProvider, getStrategies } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';

const useStrategies = () => {
  const { chainId } = useAppSelector(({ application }) => application);
  const provider = getProvider(chainId);

  const { data } = useSWR(
    provider ? `/strategies?chainId=${chainId}` : null,
    () => getStrategies(provider as ethers.providers.Web3Provider),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return data;
};

export default useStrategies;
