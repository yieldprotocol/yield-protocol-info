import { ethers } from 'ethers';
import { InferGetStaticPropsType } from 'next';
import Assets from '../../components/views/Assets';
import { getAssets } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';

const AssetsPage = ({ assetList }: InferGetStaticPropsType<typeof getStaticProps>) => <Assets assetList={assetList} />;

export default AssetsPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = new ethers.providers.JsonRpcProvider(process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]);
  const contractMap = await getContracts(provider, chainId);
  const assetMap = await getAssets(provider, contractMap);
  const assetList = Array.from(Object.values(assetMap));

  return { props: { assetList } };
};
