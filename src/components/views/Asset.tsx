import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import MainViewWrap from '../wraps/MainViewWrap';
import AssetPairTable from '../AssetPairTable';
import { markMap } from '../../config/marks';
import { IAsset } from '../../types/chain';
import useAssetPairData from '../../hooks/useAssetPairData';
import useAssets from '../../hooks/useAssets';

const Asset = ({ asset }: { asset: IAsset }) => {
  const { data: assetMap } = useAssets();
  const { data: assetPairData, loading } = useAssetPairData(asset);
  const logo = markMap.get(asset.symbol);

  return asset ? (
    <MainViewWrap>
      <div className="gap-10 px-4">
        <div className="rounded-lg p-8 align-middle justify-items-start shadow-md bg-green-100 dark:bg-green-400">
          <div className="text-lg pb-4 flex gap-x-2">
            {logo && <div className="h-6 w-6">{logo}</div>}
            <strong>{asset.symbol}</strong>
          </div>
          <div>
            <SingleItemViewGrid item={asset} />
          </div>
        </div>
      </div>
      <div className="rounded-lg align-middle justify-items-start">
        <AssetPairTable assets={assetMap} data={assetPairData} loading={loading} />
      </div>
    </MainViewWrap>
  ) : null;
};

export default Asset;
