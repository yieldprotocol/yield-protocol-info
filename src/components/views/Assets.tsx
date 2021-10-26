import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import AssetItem from '../AssetItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';

const Assets = () => {
  const assets = useAppSelector((st) => st.chain.assets);
  const assetsLoading = useAppSelector((st) => st.chain.assetsLoading);
  const [sortedAssets, setSortedAssets] = useState<any>([]);

  useEffect(() => {
    setSortedAssets([...Object.values(assets)].sort((a: any, b: any) => (a.symbol > b.symbol ? 1 : -1)));
  }, [assets]);

  if (!Object.values(assets).length) return <MainViewWrap>No Assets</MainViewWrap>;

  return (
    <MainViewWrap>
      {assetsLoading ? (
        <ClipLoader loading={assetsLoading} />
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {sortedAssets.map((a: any) => (
            <AssetItem item={a} key={a.id} />
          ))}
        </div>
      )}
    </MainViewWrap>
  );
};

export default Assets;
