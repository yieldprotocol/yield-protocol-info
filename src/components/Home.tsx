import React, { useEffect, useState } from 'react';
import { getAssetsTvl } from '../state/actions/chain';
import { useAppDispatch, useAppSelector } from '../state/hooks/general';
import { formatValue } from '../utils/appUtils';
import AnimatedNum from './AnimatedNum';
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
  const assetsTvl = useAppSelector((st) => st.chain.assetsTvl);
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const [total, setTotal] = useState<number | null>(null);
  const [tvlList, setTvlList] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getAssetsTvl(assets, contractMap, provider));
  }, [assets, contractMap, dispatch, provider]);

  // sets the total value locked for all assets combined
  useEffect(() => {
    [...Object.values(assetsTvl)].length &&
      setTotal([...Object.values(assetsTvl)].reduce((acc: number, item: any) => acc + item.value, 0));
  }, [assetsTvl]);

  useEffect(() => {
    setTvlList([...Object.values(assetsTvl as ITvl[]).sort((a: ITvl, b: ITvl) => b.value - a.value)]); // sort by largest tvl
  }, [assetsTvl]);

  return (
    <MainViewWrap>
      <div className="bg-green-50 dark:bg-green-300 rounded-xl p-10 flex justify-center">
        <div className="mt-10">
          <Summary>
            <div className="text-xl text-gray-500">Total Value Locked</div>
            {total ? (
              <div className="text-3xl flex">
                $<AnimatedNum num={total} />
              </div>
            ) : null}
          </Summary>
        </div>
        <div className="dark:text-white p-10">
          <TvlTable data={tvlList} assets={assets} />
        </div>
      </div>
    </MainViewWrap>
  );
};

export default Home;
