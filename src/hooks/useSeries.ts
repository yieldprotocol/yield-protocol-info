import { ethers } from 'ethers';
import useSWR from 'swr';
import { getProvider, getSeries } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';
import useContracts from './useContracts';

const useSeries = () => {
  const chainId = useAppSelector(({ application }) => application.chainId);
  const provider = getProvider(chainId);
  const contractMap = useContracts();

  const { data, error } = useSWR(
    provider ? `/series?chainId=${chainId}` : null,
    () => getSeries(provider as ethers.providers.Web3Provider, contractMap),
    {
      revalidateOnFocus: false,
    }
  );

  return { data, loading: !error && !data };
};

export default useSeries;
