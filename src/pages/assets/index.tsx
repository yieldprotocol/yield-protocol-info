import { ethers } from 'ethers';
import { InferGetServerSidePropsType } from 'next';
import Assets from '../../components/views/Assets';
import { getAssets } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';

const AssetsPage = ({ assetList }: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Assets assetList={assetList} />
);

export default AssetsPage;

export const getServerSideProps = async ({ query }) => {
  const chainId = (query.chainId || 1) as number;
  const provider = new ethers.providers.JsonRpcProvider(process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]);
  const contractMap = await getContracts(provider);
  const assetMap = await getAssets(provider, contractMap);
  const assetList = Array.from(Object.values(assetMap));

  return { props: { assetList } };
};
