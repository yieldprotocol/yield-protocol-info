import { ethers } from 'ethers';
import useSWR from 'swr';
import { getProvider } from '../lib/chain';
import { getContracts } from '../lib/contracts';
import { useAppSelector } from '../state/hooks/general';

const useContracts = () => {
  const { chainId } = useAppSelector(({ application }) => application);
  const provider = getProvider(chainId);

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
