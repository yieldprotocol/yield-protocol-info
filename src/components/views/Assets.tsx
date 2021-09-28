import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import AssetItem from '../AssetItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';

const Assets = () => {
  const assets = useAppSelector((st) => st.chain.assets);
  const assetsLoading = useAppSelector((st) => st.chain.assetsLoading);
  return (
    <MainViewWrap>
      {assetsLoading ? (
        <ClipLoader loading={assetsLoading} />
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[...Object.values(assets)].map((a: any) => (
            <AssetItem item={a} key={a.id} />
          ))}
        </div>
      )}
    </MainViewWrap>
  );
};

export default Assets;
