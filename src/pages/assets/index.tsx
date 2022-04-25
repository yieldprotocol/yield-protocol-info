import { InferGetStaticPropsType } from 'next';
import Spinner from '../../components/Spinner';
import Assets from '../../components/views/Assets';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useAssets from '../../hooks/useAssets';
import { getAssets, getProvider } from '../../lib/chain';
import { getContracts } from '../../lib/contracts';
import { useAppSelector } from '../../state/hooks/general';

const AssetsPage = ({ assetList }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: assetMap, loading } = useAssets();
  const chainId = useAppSelector(({ application }) => application.chainId);

  if (!assetList || (loading && chainId !== 1))
    return (
      <MainViewWrap>
        <Spinner />
      </MainViewWrap>
    );

  return <Assets assetList={assetMap ? Object.values(assetMap) : assetList} />;
};

export default AssetsPage;

export const getStaticProps = async () => {
  const chainId = 1;
  const provider = getProvider(chainId);
  const contractMap = await getContracts(provider, chainId);
  const assetMap = await getAssets(provider, contractMap);
  const assetList = Array.from(Object.values(assetMap));

  return { props: { assetList }, revalidate: 3600 };
};
