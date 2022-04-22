import SeriesItem from '../SeriesItem';
import MainViewWrap from '../wraps/MainViewWrap';
import { ISeries } from '../../types/chain';

const SeriesList = ({ seriesList }: { seriesList: ISeries[] }) => (
  <MainViewWrap>
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {seriesList.map((s) => (
        <SeriesItem item={s} key={s.id} />
      ))}
    </div>
  </MainViewWrap>
);

export default SeriesList;
