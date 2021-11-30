import { useEffect } from 'react';
import { getAssetsTvl } from '../actions/chain';
import { useAppDispatch, useAppSelector } from './general';

const useTvl = () => {
  const dispatch = useAppDispatch();
  const { provider, chainId, assets, series } = useAppSelector((st) => st.chain);
  const { contractMap } = useAppSelector((st) => st.contracts);

  useEffect(() => {
    if (assets && contractMap && series && provider && chainId) {
      dispatch(getAssetsTvl(assets, contractMap, series, provider, chainId));
    }
  }, [assets, contractMap, dispatch, provider, series, chainId]);
};

export default useTvl;
