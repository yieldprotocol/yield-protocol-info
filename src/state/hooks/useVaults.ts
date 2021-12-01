import { useEffect } from 'react';
import { getVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

export const useVaults = () => {
  const dispatch = useAppDispatch();
  const { assets, series } = useAppSelector(({ chain }) => chain);
  const { contractMap } = useAppSelector(({ contracts }) => contracts);

  useEffect(() => {
    if (contractMap && series && assets) {
      dispatch(getVaults());
    }
  }, [contractMap, series, assets, dispatch]);
};
