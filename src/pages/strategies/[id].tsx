import { useRouter } from 'next/router';
import Strategy from '../../components/views/Strategy';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useStrategies from '../../hooks/useStrategies';

const StrategiesPage = () => {
  const strategyMap = useStrategies();
  const router = useRouter();
  const { id: strategyId } = router.query;
  if (!strategyMap || !strategyId) return null;

  const strategy = strategyMap[strategyId as string];

  if (!strategy) return <MainViewWrap>Strategy does not exist on this network</MainViewWrap>;

  return <Strategy strategy={strategy} />;
};

export default StrategiesPage;
