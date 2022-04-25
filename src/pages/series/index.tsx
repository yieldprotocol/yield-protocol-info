import { InferGetStaticPropsType } from 'next';
import SeriesList from '../../components/views/SeriesList';
import useSeries from '../../hooks/useSeries';
import { getProvider, getSeries } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';
import { ISeriesMap } from '../../types/chain';

const handleSort = (strategyMap: ISeriesMap) =>
  Object.values(strategyMap)
    .sort((s1, s2) => (s1.name < s2.name ? -1 : 1))
    .sort((s1, s2) => s1.maturity - s2.maturity);

const SeriesPage = ({ seriesList }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const seriesMap = useSeries();
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
