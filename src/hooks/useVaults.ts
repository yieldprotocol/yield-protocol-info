import useSWR from 'swr';
import { getMainnetVaults } from '../lib/vaults';
import { useAppSelector } from '../state/hooks/general';
import useContracts from './useContracts';

const useVaults = (vaultId = null) => {
  const chainId = useAppSelector(({ application }) => application.chainId);
  const contractMap = useContracts();

  const { data, error } = useSWR(
    `/vaults?chainId=${chainId}${vaultId ? `&vaultId=${vaultId}` : ''}`,
    () => getMainnetVaults(contractMap, undefined, chainId, vaultId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return { data, loading: (!error && !data && chainId !== 1) || (!error && !data && vaultId) };
};

export default useVaults;
