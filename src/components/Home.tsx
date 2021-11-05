import React, { useEffect, useState } from 'react';
import { getAssetsTvl } from '../state/actions/chain';
import { useAppDispatch, useAppSelector } from '../state/hooks/general';
import { IAsset, IAssetPairData, IAssetPairMap } from '../types/chain';
import AnimatedNum from './AnimatedNum';
import Spinner from './Spinner';
import Summary from './Summary';
import TvlTable from './TvlTable';
import MainViewWrap from './wraps/MainViewWrap';

interface ITvl {
  symbol: string;
  id: string;
  value: number;
}

const Home = () => {
  const dispatch = useAppDispatch();
  const provider = useAppSelector((st) => st.chain.provider);
  const assets = useAppSelector((st) => st.chain.assets);
  const assetPairData = useAppSelector((st) => st.chain.assetPairData);
  const series = useAppSelector((st) => st.chain.series);
  const assetsTvl = useAppSelector((st) => st.chain.assetsTvl);
  const tvlLoading = useAppSelector((st) => st.chain.tvlLoading);
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const [tvl, setTvl] = useState<number | null>(null);
  const [tvlList, setTvlList] = useState<any[]>([]);
  const [totalDebt, setTotalDebt] = useState<number | null>(null);
  const [totalDebtList, setTotalDebtList] = useState<ITvl[]>([]);

  useEffect(() => {
    dispatch(getAssetsTvl(assets, contractMap, series, provider));
  }, [assets, contractMap, dispatch, provider, series]);

  // sets the total value locked for all assets combined
  useEffect(() => {
    [...Object.values(assetsTvl)].length &&
      setTvl([...Object.values(assetsTvl)].reduce((acc: number, item: any) => acc + item.value, 0));
  }, [assetsTvl]);

  useEffect(() => {
    setTvlList([
      ...Object.values(assetsTvl as ITvl[])
        .filter((x) => x.value !== 0)
        .sort((a: ITvl, b: ITvl) => b.value - a.value),
    ]); // sort by largest tvl
  }, [assetsTvl]);

  useEffect(() => {
    const assetPairList = Object.values(assetPairData as IAssetPairMap).map((assetData: IAssetPairData) => {
      const base: IAsset = assets[(assetData as any)[0]?.baseAssetId];
      const newItem = {
        id: base?.id,
        symbol: base?.symbol,
        value: Object.values(assetData).reduce((sum: number, x: IAssetPairData) => sum + +x.totalDebtInUSDC, 0),
      };
      return newItem;
    });
    setTotalDebtList(assetPairList.filter((x) => x.value !== 0).sort((a, b) => b.value - a.value)); // sort by largest debt and filter out 0
  }, [assetPairData, assets]);

  useEffect(() => {
    setTotalDebt(totalDebtList.reduce((sum: number, x: ITvl) => sum + +x.value, 0));
  }, [totalDebtList]);

  return (
    <MainViewWrap>
      <Spinner loading={tvlLoading} />
      {!tvlLoading && tvl && totalDebt ? (
        <div className="bg-green-50 dark:bg-green-300 rounded-xl p-8">
          <div className="m-8 bg-green-50 dark:bg-green-300 rounded-xl gap-10 flex justify-between">
            <Summary>
              <div className="text-xl text-gray-500">Total Value Locked</div>
              <div className="text-3xl flex">
                $<AnimatedNum num={tvl} />
              </div>
            </Summary>
            <div className="w-1/2">
              <TvlTable data={tvlList} assets={assets} />
            </div>
          </div>
          <div className="m-8 bg-green-50 dark:bg-green-300 rounded-xl gap-10 flex justify-between">
            <Summary>
              <div className="text-xl text-gray-500">Total Borrowed</div>
              <div className="text-3xl flex">
                $<AnimatedNum num={totalDebt} />
              </div>
            </Summary>
            <div className="w-1/2">
              <TvlTable data={totalDebtList} assets={assets} />
            </div>
          </div>
        </div>
      ) : null}
    </MainViewWrap>
  );
};

export default Home;
