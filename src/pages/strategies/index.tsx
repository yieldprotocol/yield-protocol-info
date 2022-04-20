import { ethers } from 'ethers';
import { InferGetServerSidePropsType } from 'next';
import Strategies from '../../components/views/Strategies';
import { getStrategies } from '../../lib/chain';

const StrategiesPage = ({ strategiesList }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Strategies strategiesList={strategiesList} />
);

export default StrategiesPage;

export const getServerSideProps = async ({ query }) => {
  const chainId = (query.chainId || 1) as number;
  const provider = new ethers.providers.JsonRpcProvider(process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]);
  const strategyMap = await getStrategies(provider);
  const strategiesList = [...Object.values(strategyMap)].sort((s1, s2) => (s1.name < s2.name ? -1 : 1));

  return { props: { strategiesList } };
};
