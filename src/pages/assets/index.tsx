import { InferGetServerSidePropsType } from 'next';
import Assets from '../../components/views/Assets';
import { getAssets, getProvider } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';

const AssetsPage = ({ assetList }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Assets assetList={assetList} />
);
export default AssetsPage;

export const getServerSideProps = async ({ query }) => {
  const chainId = +query.chainId || 1;
  const provider = getProvider(chainId);
  const contractMap = await getContracts(provider, chainId);
  const assetMap = await getAssets(provider, contractMap);
  const assetList = Array.from(Object.values(assetMap));

  return { props: { assetList } };
};
