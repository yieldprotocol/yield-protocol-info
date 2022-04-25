import { ethers } from 'ethers';
import useSWR from 'swr';
import { getProvider, getStrategies } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';

const useStrategies = () => {
  const chainId = useAppSelector(({ application }) => application.chainId);
  const provider = getProvider(chainId);

  const { data, error } = useSWR(
    provider ? `/strategies?chainId=${chainId}` : null,
    () => getStrategies(provider as ethers.providers.Web3Provider),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return { data, loading: !error && !data };
};

export default useStrategies;
