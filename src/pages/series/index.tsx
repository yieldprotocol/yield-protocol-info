import { ethers } from 'ethers';
import { InferGetServerSidePropsType } from 'next';
import SeriesList from '../../components/views/SeriesList';
import { getSeries } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';

const SeriesPage = ({ seriesList }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <SeriesList seriesList={seriesList} />
);

export default SeriesPage;

export const getServerSideProps = async ({ query }) => {
  const chainId = (query.chainId || 1) as number;
  const provider = new ethers.providers.JsonRpcProvider(process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]);
  const contractMap = await getContracts(provider);
  const seriesMap = await getSeries(provider, contractMap);

  const seriesList = [...Object.values(seriesMap)]
    .sort((s1, s2) => (s1.name < s2.name ? -1 : 1))
    .sort((s1, s2) => s1.maturity - s2.maturity);

  return { props: { seriesList } };
};
