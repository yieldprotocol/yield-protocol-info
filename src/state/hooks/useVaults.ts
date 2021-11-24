import { useEffect } from 'react';
import { IAssetMap, ISeriesMap } from '../../types/chain';
import { IContractMap } from '../../types/contracts';
import { IPriceMap } from '../../types/vaults';
import { getVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

export const useVaults = () => {
  const dispatch = useAppDispatch();
  const chainId: number = useAppSelector((st) => st.chain.chainid);
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const seriesMap: ISeriesMap = useAppSelector((st) => st.chain.series);
  const assetMap: IAssetMap = useAppSelector((st) => st.chain.assets);
  const priceMap: IPriceMap = useAppSelector((st) => st.vaults.prices);

  useEffect(() => {
    if (
      Object.values(contractMap).length > 0 &&
      Object.values(seriesMap).length > 0 &&
      Object.values(assetMap).length > 0
    ) {
      dispatch(getVaults(contractMap, seriesMap, assetMap, chainId, priceMap));
    }
  }, [contractMap, seriesMap, assetMap, dispatch]);
};
