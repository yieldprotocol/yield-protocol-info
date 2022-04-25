import { InferGetStaticPropsType } from 'next';
import Spinner from '../../components/Spinner';
import SeriesList from '../../components/views/SeriesList';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useSeries from '../../hooks/useSeries';
import { getProvider, getSeries } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';
import { useAppSelector } from '../../state/hooks/general';
import { ISeriesMap } from '../../types/chain';

const handleSort = (strategyMap: ISeriesMap) =>
  Object.values(strategyMap)
    .sort((s1, s2) => (s1.name < s2.name ? -1 : 1))
    .sort((s1, s2) => s1.maturity - s2.maturity);

const SeriesPage = ({ seriesList }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: seriesMap, loading } = useSeries();
  const chainId = useAppSelector(({ application }) => application.chainId);

  if (!seriesList || (loading && chainId !== 1))
    return (
      <MainViewWrap>
        <Spinner />
      </MainViewWrap>
    );

  return <SeriesList seriesList={seriesMap ? handleSort(seriesMap) : seriesList} />;
};

export default SeriesPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = getProvider(chainId);
  const contractMap = await getContracts(provider, chainId);
  const seriesMap = await getSeries(provider, contractMap);

  const seriesList = handleSort(seriesMap);

  return { props: { seriesList }, revalidate: 3600 };
};
