import { ethers } from 'ethers';
import { InferGetServerSidePropsType } from 'next';
import Home from '../components/views/Home';
import { getAssets, getAssetsTvl, getSeries, getTotalDebt, getTotalDebtList } from '../lib/chain';
import { getContracts } from '../lib/contracts';

const Index = ({
  assetsTvl,
  totalDebtList,
  totalDebt,
  assetMap,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Home assetsTvl={assetsTvl} totalDebtList={totalDebtList} totalDebt={totalDebt} assets={assetMap} />
);

export default Index;

export const getServerSideProps = async ({ query }) => {
  const chainId = (query.chainId || 1) as number;

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
