import { InferGetServerSidePropsType } from 'next';
import Strategies from '../../components/views/Strategies';
import { getProvider, getStrategies } from '../../lib/chain';

const StrategiesPage = ({ strategiesList }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Strategies strategiesList={strategiesList} />
);

export default StrategiesPage;

export const getServerSideProps = async ({ query }) => {
  const chainId = query.chainId || 1;
  const provider = getProvider(chainId);
  const strategyMap = await getStrategies(provider);
  const strategiesList = Object.values(strategyMap).sort((s1, s2) => (s1.name < s2.name ? -1 : 1));

  return { props: { strategiesList } };
};
