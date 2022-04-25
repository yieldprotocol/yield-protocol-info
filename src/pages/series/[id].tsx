import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useSeries from '../../hooks/useSeries';

const DynamicSeries = dynamic(() => import('../../components/views/Series'), { ssr: false });

const SeriesItem = () => {
  const { data: seriesMap } = useSeries();
  const router = useRouter();
  const { id: seriesId } = router.query;
  if (!seriesMap || !seriesId) return null;

  const series = seriesMap![seriesId as string];

  if (!series) return <MainViewWrap>Series does not exist on this network</MainViewWrap>;

  return <DynamicSeries series={series} />;
};

export default SeriesItem;
