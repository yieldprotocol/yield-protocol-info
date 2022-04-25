import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useAssets from '../../hooks/useAssets';

const DynamicAsset = dynamic(() => import('../../components/views/Asset'), { ssr: false });

const AssetPage = () => {
  const { data: assetMap } = useAssets();
  const router = useRouter();
  const { id: assetId } = router.query;
  if (!assetMap || !assetId) return null;

  const asset = assetMap[assetId as string];

  if (!asset) return <MainViewWrap>Asset does not exist on this network</MainViewWrap>;

  return <DynamicAsset asset={asset} />;
};

export default AssetPage;
