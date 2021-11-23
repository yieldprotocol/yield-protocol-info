import { ethers } from 'ethers';
import { useEffect } from 'react';
import { IAssetMap, ISeriesMap } from '../../types/chain';
import { IContractMap } from '../../types/contracts';
import { IPriceMap } from '../../types/vaults';
import { getAssetsTvl } from '../actions/chain';
import { useAppDispatch, useAppSelector } from './general';

const useTvl = () => {
  const dispatch = useAppDispatch();
  const provider: ethers.providers.JsonRpcProvider = useAppSelector((st) => st.chain.provider);
  const chainId: number = useAppSelector((st) => st.chain.chainId);
  const assets: IAssetMap = useAppSelector((st) => st.chain.assets);
  const series: ISeriesMap = useAppSelector((st) => st.chain.series);
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const priceMap: IPriceMap = useAppSelector((st) => st.vaults.priceMap);

  useEffect(() => {
    dispatch(getAssetsTvl(assets, contractMap, series, priceMap, provider, chainId));
  }, [assets, contractMap, dispatch, provider, series, priceMap, chainId]);
};

export default useTvl;
