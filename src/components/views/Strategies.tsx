import StrategyItem from '../StrategyItem';
import MainViewWrap from '../wraps/MainViewWrap';
import { IStrategy } from '../../types/chain';

const Strategies = ({ strategiesList }: { strategiesList: IStrategy[] }) => (
  <MainViewWrap>
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {strategiesList.map((s) => (
        <StrategyItem item={s} key={s.id} />
      ))}
    </div>
  </MainViewWrap>
);

export default Strategies;
