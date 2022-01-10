import { useEffect } from 'react';
import { getVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

export const useVaults = () => {
  const dispatch = useAppDispatch();
  const { assets, series, chainId } = useAppSelector(({ chain }) => chain);
  const { contractMap } = useAppSelector(({ contracts }) => contracts);

  useEffect(() => {
    if (contractMap && series && assets && chainId === 1) {
      // only get vaults for mainnet
      dispatch(getVaults());
    }
  }, [contractMap, series, assets, dispatch, chainId]);
};
