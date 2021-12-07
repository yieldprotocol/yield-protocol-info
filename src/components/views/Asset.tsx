import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import MainViewWrap from '../wraps/MainViewWrap';
import AssetPairTable from '../AssetPairTable';
import { markMap } from '../../config/marks';
import { IAsset, IAssetPairData } from '../../types/chain';

const Asset: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { assets, assetPairData, assetPairDataLoading } = useAppSelector(({ chain }) => chain);
  const [asset, setAsset] = useState<IAsset | undefined>();
  const [thisAssetPairData, setThisAssetPairData] = useState<IAssetPairData[]>([]);
  const [logo, setLogo] = useState<any>();

  useEffect(() => {
    if (assets) {
      const _asset = assets[id];
      setAsset(_asset);
      setLogo(markMap.get(_asset.symbol));
    }
  }, [assets, id]);

  useEffect(() => {
    if (asset && assetPairData) {
      const _thisAssetPairData = assetPairData[asset.id];
      _thisAssetPairData && setThisAssetPairData(_thisAssetPairData);
    }
  }, [asset, assetPairData]);

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
        <div className="rounded-lg p-8 align-middle justify-items-start">
          <AssetPairTable data={thisAssetPairData} loading={assetPairDataLoading} />
        </div>
      </div>
    </MainViewWrap>
  ) : null;
};

export default Asset;
