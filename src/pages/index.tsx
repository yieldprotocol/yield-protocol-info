import { ethers } from 'ethers';
import { InferGetStaticPropsType } from 'next';
import Spinner from '../components/Spinner';
import Home from '../components/views/Home';
import MainViewWrap from '../components/wraps/MainViewWrap';
import useHomePageData from '../hooks/useHomePageData';
import { getAssets, getAssetsTvl, getSeries, getTotalDebt, getTotalDebtList } from '../lib/chain';
import { getContracts } from '../lib/contracts';

const Index = ({ assetsTvl, totalDebtList, totalDebt, assetMap }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data, loading } = useHomePageData();

  if (loading && !assetsTvl)
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
    />
  );
};

export default Index;

export const getStaticProps = async () => {
  const chainId = 1;

  const provider = new ethers.providers.JsonRpcProvider(process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]);

  // get asset tvl data
  const contractMap = await getContracts(provider, chainId);
  const assetMap = await getAssets(provider, contractMap);
  const seriesMap = await getSeries(provider, contractMap);
  const assetsTvl = await getAssetsTvl(provider, contractMap, assetMap, seriesMap);

  // get total debt data
  const totalDebtList = await getTotalDebtList(provider, contractMap, seriesMap, assetMap);
  const totalDebt = getTotalDebt(totalDebtList);

  return { props: { assetsTvl, totalDebtList, totalDebt, assetMap } };
};
