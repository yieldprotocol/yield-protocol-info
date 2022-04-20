import { ethers } from 'ethers';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Home from '../components/views/Home';
import { useCachedState } from '../hooks/useCachedState';
import { getAssets, getAssetsTvl, getSeries } from '../lib/chain';
import { getContracts } from '../lib/contracts';
import { updateChainId, updateProvider } from '../state/actions/chain';
import { useAppDispatch } from '../state/hooks/general';

const Index = ({ assetsTvl }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [cachedChainId, setCachedChainId] = useCachedState('chainId', 1);

  useEffect(() => {
    const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
      process.env[`REACT_APP_RPC_URL_${cachedChainId.toString()}`]
    );
    dispatch(updateProvider(provider));
  }, []);

  useEffect(() => {
    dispatch(updateChainId(cachedChainId));
  }, [setCachedChainId]);

  useEffect(() => {
    router.replace(`/?chainId=${cachedChainId}`);
  }, []);

  return <Home assetsTvl={assetsTvl} />;
};

export default Index;

export const getServerSideProps = async ({ query }) => {
  const chainId = (query.chainId || 1) as number;

  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
    process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]
  );

  const contractMap = await getContracts(provider);
  const assets = await getAssets(provider, contractMap);
  const seriesMap = await getSeries(provider, contractMap);
  const assetsTvl = await getAssetsTvl(provider, contractMap, assets, seriesMap);
  return { props: { assetsTvl } };
};
