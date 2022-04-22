import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useStrategies from '../../hooks/useStrategies';

const DynamicStrategy = dynamic(() => import('../../components/views/Strategy'), { ssr: false });

const StrategiesPage = () => {
  const strategyMap = useStrategies();
  const router = useRouter();
  const { id: strategyId } = router.query;
  if (!strategyMap || !strategyId) return null;

  const strategy = strategyMap[strategyId as string];

  if (!strategy) return <MainViewWrap>Strategy does not exist on this network</MainViewWrap>;

  return <DynamicStrategy strategy={strategy} />;
};

export default StrategiesPage;
