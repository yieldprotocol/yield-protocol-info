import { useRouter } from 'next/router';
import Series from '../../components/views/Series';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useSeries from '../../hooks/useSeries';

const SeriesItem = () => {
  const seriesMap = useSeries();
  const router = useRouter();
  const { id: seriesId } = router.query;
  if (!seriesMap || !seriesId) return null;

  const series = seriesMap![seriesId as string];

  if (!series) return <MainViewWrap>Series does not exist on this network</MainViewWrap>;

  return <Series series={series} />;
};

export default SeriesItem;
