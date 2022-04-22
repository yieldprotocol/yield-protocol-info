import { useEffect, useState } from 'react';
import AssetItem from '../AssetItem';
import MainViewWrap from '../wraps/MainViewWrap';
import { IAsset } from '../../types/chain';

const Assets = ({ assetList }: { assetList: IAsset[] }) => {
  const [sortedAssets, setSortedAssets] = useState<IAsset[]>();

  useEffect(() => {
    setSortedAssets(assetList.sort((a, b) => (a.symbol > b.symbol ? 1 : -1)));
  }, [assetList]);

  if (!sortedAssets) return <MainViewWrap>No Assets</MainViewWrap>;

  return (
    <MainViewWrap>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {sortedAssets.map((a) => (
          <AssetItem item={a} key={a.id} />
        ))}
      </div>
    </MainViewWrap>
  );
};

export default Assets;
