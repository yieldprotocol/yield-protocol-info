import { useEffect } from 'react';
import { getVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

export const useVaults = () => {
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const series = useAppSelector((st) => st.chain.series);
  const assets = useAppSelector((st) => st.chain.assets);
  const prices = useAppSelector((st) => st.vaults.prices);

  useEffect(() => {
    if (Object.values(contractMap).length && Object.values(series).length && Object.values(assets).length)
      dispatch(getVaults(prices, contractMap, series, assets));
  }, [contractMap, series, assets, prices, dispatch]);
};
