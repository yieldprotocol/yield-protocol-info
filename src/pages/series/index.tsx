import { ethers } from 'ethers';
import { InferGetStaticPropsType } from 'next';
import SeriesList from '../../components/views/SeriesList';
import useSeries from '../../hooks/useSeries';
import { getSeries } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';

const SeriesPage = ({ seriesList }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const seriesMap = useSeries();
  return <SeriesList seriesList={seriesMap ? Object.values(seriesMap) : seriesList} />;
};

export default SeriesPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = new ethers.providers.JsonRpcProvider(process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]);
  const contractMap = await getContracts(provider, chainId);
  const seriesMap = await getSeries(provider, contractMap);

  const seriesList = Object.values(seriesMap)
    .sort((s1, s2) => (s1.name < s2.name ? -1 : 1))
    .sort((s1, s2) => s1.maturity - s2.maturity);

  return { props: { seriesList } };
};
