import { ethers } from 'ethers';
import { InferGetStaticPropsType } from 'next';
import Strategies from '../../components/views/Strategies';
import useStrategies from '../../hooks/useStrategies';
import { getStrategies } from '../../lib/chain';

const StrategiesPage = ({ strategiesList }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const strategyMap = useStrategies();
  return <Strategies strategiesList={strategyMap ? Object.values(strategyMap) : strategiesList} />;
};

export default StrategiesPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = new ethers.providers.JsonRpcProvider(process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]);
  const strategyMap = await getStrategies(provider);
  const strategiesList = Object.values(strategyMap).sort((s1, s2) => (s1.name < s2.name ? -1 : 1));

  return { props: { strategiesList } };
};
