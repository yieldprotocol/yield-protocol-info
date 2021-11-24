import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import MainViewWrap from '../wraps/MainViewWrap';
import AssetPairTable from '../AssetPairTable';
import { markMap } from '../../config/marks';
import { IAsset, IAssetMap, IAssetPairData, IAssetPairMap } from '../../types/chain';

const Asset: FC = () => {
  const { id } = useParams<{ id: string }>();
  const assets: IAssetMap = useAppSelector((st) => st.chain.assets);
  const assetPairData: IAssetPairMap = useAppSelector((st) => st.chain.assetPairData);
  const asset: IAsset = assets[id];
  const thisAssetPairData: IAssetPairData = assetPairData[asset.id];
  const logo = markMap?.get(asset?.symbol);

  return asset ? (
    <MainViewWrap>
      <div className="lg:flex gap-10 px-4">
        <div className="rounded-lg p-8 align-middle justify-items-start shadow-md bg-green-100 dark:bg-green-400">
          <div className="text-lg pb-4 flex gap-x-2">
            {logo && <div className="h-6 w-6">{logo}</div>}
            <strong>{asset.symbol}</strong>
          </div>
          <div>
            <SingleItemViewGrid item={asset} />
          </div>
        </div>
        {thisAssetPairData && (
          <div className="rounded-lg p-8 align-middle justify-items-start shadow-sm">
            <AssetPairTable data={thisAssetPairData} assets={assets} />
          </div>
        )}
      </div>
    </MainViewWrap>
  ) : null;
};

export default Asset;
