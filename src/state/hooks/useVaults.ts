import { useEffect } from 'react';
import { IAssetMap, ISeriesMap } from '../../types/chain';
import { IContractMap } from '../../types/contracts';
import { IVaultMap } from '../../types/vaults';
import { getVaults, updateVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

export const useVaults = () => {
  const dispatch = useAppDispatch();
  const chainId: number = useAppSelector((st) => st.chain.chainid);
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const seriesMap: ISeriesMap = useAppSelector((st) => st.chain.series);
  const assetMap: IAssetMap = useAppSelector((st) => st.chain.assets);
  const priceMap = useAppSelector((st) => st.vaults.prices);
  const vaultMap: IVaultMap = useAppSelector((st) => st.vaults.vaults);

  useEffect(() => {
    if (Object.values(vaultMap).length) return;
    if (Object.values(contractMap).length && Object.values(seriesMap).length && Object.values(assetMap).length) {
      dispatch(getVaults(contractMap, seriesMap, assetMap, chainId, priceMap));
    } else {
      dispatch(updateVaults({}));
    }
  }, [contractMap, seriesMap, assetMap, priceMap, dispatch, chainId, vaultMap]);
};
