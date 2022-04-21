import { useRouter } from 'next/router';
import Asset from '../../components/views/Asset';
import MainViewWrap from '../../components/wraps/MainViewWrap';
import useAssets from '../../hooks/useAssets';

const AssetPage = () => {
  const assetMap = useAssets();
  const router = useRouter();
  const { id: assetId } = router.query;
  if (!assetMap || !assetId) return null;

  const asset = assetMap[assetId as string];

  if (!asset) return <MainViewWrap>Asset does not exist on this network</MainViewWrap>;

  return <Asset asset={asset} />;
};

export default AssetPage;
