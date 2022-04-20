import { useRouter } from 'next/router';
import Series from '../../components/views/Series';
import useSeries from '../../hooks/useSeries';

const SeriesItem = () => {
  const seriesMap = useSeries();
  const router = useRouter();
  const { id: seriesId } = router.query;
  if (!seriesMap || !seriesId) return null;

  const series = seriesMap![seriesId as string];

  return <Series series={series} />;
};

export default SeriesItem;
