import { ethers } from 'ethers';
import useSWR from 'swr';
import { getProvider, getSeries } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';
import useContracts from './useContracts';

const useSeries = () => {
  const { chainId } = useAppSelector(({ application }) => application);
  const provider = getProvider(chainId);
  const contractMap = useContracts();

  const { data } = useSWR(
    provider ? `/series?chainId=${chainId}` : null,
    () => getSeries(provider as ethers.providers.Web3Provider, contractMap),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return data;
};

export default useSeries;
