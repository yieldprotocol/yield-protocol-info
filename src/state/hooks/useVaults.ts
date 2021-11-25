import { useEffect } from 'react';
import { getVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

export const useVaults = () => {
  const dispatch = useAppDispatch();
  const { chainId, assets, series } = useAppSelector(({ chain }) => chain);
  const { contractMap } = useAppSelector(({ contracts }) => contracts);
  const { prices } = useAppSelector(({ vaults }) => vaults);

  useEffect(() => {
    if (contractMap && series && assets) {
      dispatch(getVaults(contractMap, series, assets, chainId, prices));
    }
  }, [contractMap, series, assets, dispatch]);
};
