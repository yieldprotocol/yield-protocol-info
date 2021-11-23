import React, { FC, useEffect, useState } from 'react';
import AssetItem from '../AssetItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';
import Spinner from '../Spinner';
import { IAsset, IAssetMap } from '../../types/chain';

const Assets: FC = () => {
  const assets = useAppSelector((st) => st.chain.assets);
  const assetsLoading = useAppSelector((st) => st.chain.assetsLoading);
  const [sortedAssets, setSortedAssets] = useState<IAsset[]>([]);

  useEffect(() => {
    setSortedAssets(
      [...Object.values(assets as IAssetMap)].sort((a: IAsset, b: IAsset) => (a.symbol > b.symbol ? 1 : -1))
    );
  }, [assets]);

  if (!Object.values(assets).length) return <MainViewWrap>No Assets</MainViewWrap>;

  return (
    <MainViewWrap>
      <Spinner loading={assetsLoading} />
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {sortedAssets.map((a: IAsset) => (
          <AssetItem item={a} key={a.id} />
        ))}
      </div>
    </MainViewWrap>
  );
};

export default Assets;
