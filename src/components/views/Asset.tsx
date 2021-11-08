import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import MainViewWrap from '../wraps/MainViewWrap';
import AssetPairTable from '../AssetPairTable';
import { markMap } from '../../config/marks';

const Asset = () => {
  const { id } = useParams<{ id: string }>();
  const assets = useAppSelector((st) => st.chain.assets);
  const assetPairData = useAppSelector((st) => st.chain.assetPairData);
  const asset = assets[id];
  const thisAssetPairData = assetPairData[asset.id];
  const logo = markMap?.get(asset?.symbol);

  return asset ? (
    <MainViewWrap>
      <div className="flex gap-10">
        <div className="rounded-lg p-8 align-middle justify-items-start shadow-md bg-green-100 dark:bg-green-400">
          <div className="text-lg pb-4 flex gap-x-2">
            {logo && <div className="h-6 w-6">{logo}</div>}
            <strong>{asset.symbol}</strong>
          </div>
          <div>
            <SingleItemViewGrid item={asset} />
          </div>
        </div>
        {thisAssetPairData?.length && assets && (
          <div className="rounded-lg p-8 align-middle justify-items-start shadow-sm">
            <AssetPairTable data={thisAssetPairData} assets={assets} />
          </div>
        )}
      </div>
    </MainViewWrap>
  ) : null;
};

export default Asset;
