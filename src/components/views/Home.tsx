import { useEffect, useState } from 'react';
import { ITotalDebtItem } from '../../lib/chain/types';
import { IAssetMap } from '../../types/chain';
import AnimatedNum from '../AnimatedNum';
import Summary from '../Summary';
import TvlTable from '../TvlTable';
import MainViewWrap from '../wraps/MainViewWrap';
import SkeletonWrap from '../wraps/SkeletonWrap';

interface Tvl {
  symbol: string;
  id: string;
  value: number;
  hasMatured: boolean;
}

interface HomeProps {
  assetsTvl: Tvl[];
  totalDebtList: ITotalDebtItem[];
  totalDebt: number;
  assets: IAssetMap;
}

const Home = ({ assetsTvl, totalDebtList, totalDebt, assets }: HomeProps) => {
  const [tvl, setTvl] = useState<number>();
  const [tvlList, setTvlList] = useState<Tvl[]>([]);

  console.log('%c rendering home', 'color: green; font-size: 16px; font-weight: bold;');

  // sets the total value locked for all assets combined
  useEffect(() => {
    Object.values(assetsTvl).length &&
      setTvl(Object.values(assetsTvl).reduce((acc: number, item) => acc + item.value, 0));
  }, [assetsTvl]);

  useEffect(() => {
    // sort by tvl and filter out matured assets
    const tvlItems = Object.values(assetsTvl)
      .sort((a, b) => b.value - a.value)
      .filter((asset) => !asset.hasMatured);

    setTvlList(tvlItems);
  }, [assetsTvl]);

  return (
    <MainViewWrap>
      <div className="bg-green-50 dark:bg-green-300 rounded-xl p-8">
        <div className="m-8 bg-green-50 dark:bg-green-300 rounded-xl gap-10 flex justify-between">
          <Summary>
            <div className="text-xl text-gray-500">Total Value Locked</div>
            <div className="text-3xl flex w-52">
              {!tvl ? (
                <SkeletonWrap width={150} />
              ) : (
                <>
                  $<AnimatedNum num={tvl!} />
                </>
              )}
            </div>
          </Summary>
          <div className="w-64">{tvlList.length > 0 && <TvlTable data={tvlList} assets={assets} />}</div>
        </div>
        <div className="m-8 bg-green-50 dark:bg-green-300 rounded-xl gap-10 flex justify-between">
          <Summary>
            <div className="text-xl text-gray-500">Total Borrowed</div>
            <div className="text-3xl flex">
              {!totalDebt ? (
                <SkeletonWrap width={150} />
              ) : (
                <>
                  $<AnimatedNum num={totalDebt} />
                </>
              )}
            </div>
          </Summary>
          <div className="w-64">{totalDebt > 0 && <TvlTable data={totalDebtList} assets={assets} />}</div>
        </div>
      </div>
    </MainViewWrap>
  );
};

export default Home;
