import React, { FC, useEffect, useState } from 'react';
import useTotalDebt from '../hooks/useTotalDebt';
import { compareOraclePrices } from '../state/actions/vaults';
import { useAppSelector } from '../state/hooks/general';
import AnimatedNum from './AnimatedNum';
import Summary from './Summary';
import TvlTable from './TvlTable';
import MainViewWrap from './wraps/MainViewWrap';
import SkeletonWrap from './wraps/SkeletonWrap';

const Home: FC = () => {
  const { assets, assetsTvl, tvlLoading } = useAppSelector(({ chain }) => chain);

  const [tvl, setTvl] = useState<number | null>(null);
  const [tvlList, setTvlList] = useState<any[]>([]);
  const { totalDebt, loading: totalDebtLoading, totalDebtList } = useTotalDebt();

  // sets the total value locked for all assets combined
  useEffect(() => {
    Object.values(assetsTvl).length &&
      setTvl(Object.values(assetsTvl).reduce((acc: number, item: any) => acc + item.value, 0));
  }, [assetsTvl]);

  useEffect(() => {
    setTvlList(Object.values(assetsTvl).sort((a, b) => +b.value - +a.value)); // sort by largest tvl
  }, [assetsTvl]);

  useEffect(() => {
    compareOraclePrices(assets);
  }, [assets]);

  return (
    <MainViewWrap>
      <div className="bg-green-50 dark:bg-green-300 rounded-xl p-8">
        <div className="m-8 bg-green-50 dark:bg-green-300 rounded-xl gap-10 flex justify-between">
          <Summary>
            <div className="text-xl text-gray-500">Total Value Locked</div>
            <div className="text-3xl flex w-52">
              {tvl && !tvlLoading ? (
                <>
                  $<AnimatedNum num={tvl} />
                </>
              ) : (
                <SkeletonWrap width={150} />
              )}
            </div>
          </Summary>
          <div className="w-52">{tvlList.length > 0 && <TvlTable data={tvlList} />}</div>
        </div>
        <div className="m-8 bg-green-50 dark:bg-green-300 rounded-xl gap-10 flex justify-between">
          <Summary>
            <div className="text-xl text-gray-500">Total Borrowed</div>
            <div className="text-3xl flex">
              {totalDebt && !totalDebtLoading ? (
                <>
                  $<AnimatedNum num={totalDebt} />
                </>
              ) : (
                <SkeletonWrap width={150} />
              )}
            </div>
          </Summary>
          <div className="w-52">{totalDebt! > 0 && !tvlLoading && <TvlTable data={totalDebtList} />}</div>
        </div>
      </div>
    </MainViewWrap>
  );
};

export default Home;
