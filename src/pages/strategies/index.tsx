import { InferGetStaticPropsType } from 'next';
import Spinner from '../../components/Spinner';
import Strategies from '../../components/views/Strategies';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useStrategies from '../../hooks/useStrategies';
import { getProvider, getStrategies } from '../../lib/chain';
import { useAppSelector } from '../../state/hooks/general';

const StrategiesPage = ({ strategiesList }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: strategyMap, loading } = useStrategies();
  const chainId = useAppSelector(({ application }) => application.chainId);

  if (!strategiesList || (loading && chainId !== 1))
    return (
      <MainViewWrap>
        <Spinner />
      </MainViewWrap>
    );

  return <Strategies strategiesList={strategyMap ? Object.values(strategyMap) : strategiesList} />;
};

export default StrategiesPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = getProvider(chainId);
  const strategyMap = await getStrategies(provider);
  const strategiesList = Object.values(strategyMap).sort((s1, s2) => (s1.name < s2.name ? -1 : 1));

  return { props: { strategiesList }, revalidate: 3600 };
};
