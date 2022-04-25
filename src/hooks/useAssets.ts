import { ethers } from 'ethers';
import useSWR from 'swr';
import { getAssets, getProvider } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';
import useContracts from './useContracts';

const useAssets = () => {
  const chainId = useAppSelector(({ application }) => application.chainId);
  const provider = getProvider(chainId);
  const contractMap = useContracts();

  const { data } = useSWR(
    provider ? `/assets?chainId=${chainId}` : null,
    () => getAssets(provider as ethers.providers.Web3Provider, contractMap),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return data;
};

export default useAssets;
