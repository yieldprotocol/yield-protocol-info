import { InferGetStaticPropsType } from 'next';
import Spinner from '../components/Spinner';
import Home from '../components/views/Home';
import MainViewWrap from '../components/wraps/MainViewWrap';
import useHomePageData from '../hooks/useHomePageData';
import { getAssets, getAssetsTvl, getProvider, getSeries, getTotalDebt, getTotalDebtList, getAssetJoinTotalsInUSDC } from '../lib/chain';
import { getContracts } from '../lib/contracts';
import { useAppSelector } from '../state/hooks/general';

const Index = ({ assetsTvl, totalDebtList, totalDebt, assetMap, joinBalancesUSDC }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data, loading } = useHomePageData();
  const chainId = useAppSelector(({ application }) => application.chainId);

  if (!assetsTvl || (loading && chainId !== 1))
    return (
      <MainViewWrap>
        <Spinner />
      </MainViewWrap>
    );

  return (
    <Home
      assetsTvl={data?.assetsTvl ?? assetsTvl}
      totalDebtList={data?.totalDebtList ?? totalDebtList}
      totalDebt={data?.totalDebt ?? totalDebt}
      assets={data?.assetMap ?? assetMap}
      joinBalancesUSDC={data?.joinBalancesUSDC ?? joinBalancesUSDC}
    />
  );
};

export default Index;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = getProvider(chainId);

  // get asset tvl data
  const contractMap = await getContracts(provider, chainId);
  const assetMap = await getAssets(provider, contractMap);
  const seriesMap = await getSeries(provider, contractMap);
  const assetsTvl = await getAssetsTvl(provider, contractMap, assetMap, seriesMap);
  const joinBalancesUSDC = await getAssetJoinTotalsInUSDC(provider, assetMap, contractMap);

  // get total debt data
  const totalDebtList = await getTotalDebtList(provider, contractMap, seriesMap, assetMap);
  const totalDebt = getTotalDebt(totalDebtList);

  return { props: { assetsTvl, totalDebtList, totalDebt, assetMap, joinBalancesUSDC }, revalidate: 3600 };
};
