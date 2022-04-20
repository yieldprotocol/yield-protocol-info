import { useRouter } from 'next/router';
import Strategy from '../../components/views/Strategy';
import useStrategies from '../../hooks/useStrategies';

const AssetPage = () => {
  const strategyMap = useStrategies();
  const router = useRouter();
  const { id: strategyId } = router.query;
  if (!strategyMap || !strategyId) return null;

  const strategy = strategyMap[strategyId as string];

  return <Strategy strategy={strategy} />;
};

export default AssetPage;
