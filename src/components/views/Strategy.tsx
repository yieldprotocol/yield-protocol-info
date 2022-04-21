import { cleanValue } from '../../utils/appUtils';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import SkeletonWrap from '../wraps/SkeletonWrap';
import { useStrategyReturns } from '../../hooks/useStrategyReturns';
import { IStrategy } from '../../types/chain';

const Strategy = ({ strategy }: { strategy: IStrategy }) => {
  const { strategyReturns, secondsToDays } = useStrategyReturns(strategy, 50000);

  return (
    <MainViewWrap>
      <div className="rounded-lg p-8 align-middle justify-items-start shadow-md dark:bg-green-400 bg-green-100">
        <div className="text-md pb-4">
          <strong>{strategy.symbol}</strong>
          <div className="pt-2">
            <i>
              {strategyReturns ? (
                <>
                  APY: {cleanValue(strategyReturns?.toString(), 2)}% using last {secondsToDays}
                </>
              ) : (
                <SkeletonWrap />
              )}
            </i>
          </div>
        </div>
        <SingleItemViewGrid item={strategy} />
      </div>
    </MainViewWrap>
  );
};

export default Strategy;
