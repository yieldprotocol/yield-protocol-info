import { useEffect, useState } from 'react';
import { ITotalDebtItem } from '../../lib/chain/types';
import { IAssetMap } from '../../types/chain';
import AnimatedNum from '../AnimatedNum';
import Summary from '../Summary';
import TvlTable from '../TvlTable';
import MainViewWrap from '../wraps/MainViewWrap';
import SkeletonWrap from '../wraps/SkeletonWrap';
import Button  from '../Button';
import { formatValue } from '../../utils/appUtils';

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
  joinBalancesUSDC?: number;
}

const Home = ({ assetsTvl, totalDebtList, totalDebt, assets, joinBalancesUSDC }: HomeProps) => {
  const [tvl, setTvl] = useState<number>();
  const [tvlList, setTvlList] = useState<Tvl[]>([]);
  const [debtList, setDebtList] = useState<ITotalDebtItem[]>([]);
  const [showZeroBalances, setShowZeroBalances] = useState<boolean>(false);

  // sets the total value locked for all assets combined
  useEffect(() => {
    Object.values(assetsTvl).length &&
      setTvl(Object.values(assetsTvl).reduce((acc: number, item) => acc + item.value, 0));
  }, [assetsTvl]);

  useEffect(() => {
    // sort by tvl and filter out matured assets
    const tvlItems = Object.values(assetsTvl)
      .sort((a, b) => b.value - a.value)
      .filter(
        (asset) => !asset.hasMatured || (asset.hasMatured && asset.value > 0)
      )

    // If showZeroBalances is false, filter out assets with zero value
  if (!showZeroBalances) {
    const filteredTvlItems = tvlItems.filter((asset) => asset.value > 0);
    setTvlList(filteredTvlItems);
  } else {
    // If showZeroBalances is true, set the original tvlItems
    setTvlList(tvlItems);
  }
  }, [assetsTvl, showZeroBalances]);

  useEffect(() => {
    // sort by totalDebt and filter out matured assets
    const totalDebtItems = Object.values(totalDebtList)

    // If showZeroBalances is false, filter out assets with zero value
    if (!showZeroBalances) {
      const filteredTotalDebtItems = totalDebtItems.filter((asset) => asset.value > 0);
      setDebtList(filteredTotalDebtItems);
    } else {
      // If showZeroBalances is true, set the original totalDebtItems
      setDebtList(totalDebtItems);
    }
  }, [totalDebtList, showZeroBalances])

  return (
    <MainViewWrap>
      <div className="bg-green-50 dark:bg-green-300 rounded-xl p-8">

    Solvency ratio: <span className="mr-2 px-3 py-1 text-sm bg-green-300 rounded-full">{` ${joinBalancesUSDC ? ((joinBalancesUSDC * 100) / totalDebt).toFixed(2) : '-'}%`}</span>
    Solvency Margin: <span className="mr-2 px-3 py-1 text-sm bg-green-300 rounded-full">{`$${joinBalancesUSDC && totalDebt ? formatValue((joinBalancesUSDC - totalDebt).toFixed(2),2) : '-'}`}</span>
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
            <div>
              <Button 
                action={() => setShowZeroBalances(!showZeroBalances)}
                label={showZeroBalances ? 'Hide zero balances' : 'Show zero balances'}
                className="mt-3"
              />
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
          <div className="w-64">{totalDebt > 0 && <TvlTable data={debtList} assets={assets} />}</div>
        </div>
      </div>
    </MainViewWrap>
  );
};

export default Home;
