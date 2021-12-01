import { useEffect } from 'react';
import { getAssetsTvl } from '../actions/chain';
import { useAppDispatch, useAppSelector } from './general';

const useTvl = () => {
  const dispatch = useAppDispatch();
  const { provider, chainId, assets, series } = useAppSelector(({ chain }) => chain);
  const { contractMap } = useAppSelector(({ contracts }) => contracts);

  useEffect(() => {
    if (assets && contractMap && series && provider && chainId) {
      dispatch(getAssetsTvl(assets, contractMap, series, provider, chainId));
    }
  }, [assets, contractMap, dispatch, provider, series, chainId]);
};

export default useTvl;
