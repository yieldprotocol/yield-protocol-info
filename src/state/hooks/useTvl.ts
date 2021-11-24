import { useEffect } from 'react';
import { getAssetsTvl } from '../actions/chain';
import { useAppDispatch, useAppSelector } from './general';

const useTvl = () => {
  const dispatch = useAppDispatch();
  const provider = useAppSelector((st) => st.chain.provider);
  const assets = useAppSelector((st) => st.chain.assets);
  const series = useAppSelector((st) => st.chain.series);
  const contractMap = useAppSelector((st) => st.contracts.contractMap);

  useEffect(() => {
    dispatch(getAssetsTvl(assets, contractMap, series, provider));
  }, [assets, contractMap, dispatch, provider, series]);
};

export default useTvl;
