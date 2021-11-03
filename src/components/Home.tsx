import React, { useEffect, useState } from 'react';
import { getAssetsTvl } from '../state/actions/chain';
import { useAppDispatch, useAppSelector } from '../state/hooks/general';
import { formatValue } from '../utils/appUtils';
import AnimatedNum from './AnimatedNum';
import Summary from './Summary';
import TvlTable from './TvlTable';
import MainViewWrap from './wraps/MainViewWrap';

const Home = () => {
  const dispatch = useAppDispatch();
  const provider = useAppSelector((st) => st.chain.provider);
  const assets = useAppSelector((st) => st.chain.assets);
  const assetsTvl = useAppSelector((st) => st.chain.assetsTvl);
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getAssetsTvl(assets, contractMap, provider));
  }, [assets, contractMap, dispatch, provider]);

  // sets the total value locked for all assets combined
  useEffect(() => {
    [...Object.values(assetsTvl)].length &&
      setTotal([...Object.values(assetsTvl)].reduce((acc: number, item: any) => acc + item.value, 0));
  }, [assetsTvl]);

  return (
    <MainViewWrap>
      <div className="bg-green-50 dark:bg-green-300 rounded-xl p-10 flex justify-center">
        <div className="mt-10">
          <Summary>
            <div className="text-xl text-gray-500">Total Value Locked</div>
            {total && (
              <div className="text-3xl flex">
                $<AnimatedNum num={total} />
              </div>
            )}
          </Summary>
        </div>
        <div className="dark:text-white p-10">
          <TvlTable data={[...assetsTvl]} assets={assets} />
        </div>
      </div>
    </MainViewWrap>
  );
};

export default Home;
