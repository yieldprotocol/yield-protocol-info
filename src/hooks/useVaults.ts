import { useWeb3React } from '@web3-react/core';
import useSWR from 'swr';
import { getMainnetVaults, getNotMainnetVaults } from '../lib/vaults';
import useAssets from './useAssets';
import useContracts from './useContracts';
import useSeries from './useSeries';

const useVaults = (vaultId = undefined) => {
  const { chainId } = useWeb3React();
  const contractMap = useContracts();
  const seriesMap = useSeries();
  const assetMap = useAssets();

  const { data } = useSWR(
    `/vaults?chainId=${chainId}`,
    () =>
      chainId === 1
        ? getMainnetVaults(contractMap, undefined, chainId, vaultId)
        : getNotMainnetVaults(contractMap, undefined, seriesMap, assetMap, chainId, vaultId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return data;
};

export default useVaults;
