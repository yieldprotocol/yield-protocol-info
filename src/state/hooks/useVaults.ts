import { useEffect } from 'react';
import { getVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

export const useVaults = () => {
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const series = useAppSelector((st) => st.chain.series);

  useEffect(() => {
    if (Object.values(contractMap).length && Object.values(series).length) dispatch(getVaults(contractMap, series));
  }, [contractMap, series, dispatch]);
};
