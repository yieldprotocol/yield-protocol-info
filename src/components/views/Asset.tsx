import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import MainViewWrap from '../wraps/MainViewWrap';
import AssetPairTable from '../AssetPairTable';
import { markMap } from '../../config/marks';
import { getAssetPairData } from '../../state/actions/chain';

const Asset = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const assets = useAppSelector((st) => st.chain.assets);
  const assetPairData = useAppSelector((st) => st.chain.assetPairData);
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const asset = assets[id];
  const thisAssetPairData = assetPairData[asset.id];
  const logo = markMap?.get(asset?.symbol);

  useEffect(() => {
    dispatch(getAssetPairData(asset, assets, contractMap));
  }, [dispatch, asset, assets, contractMap]);

  return asset ? (
    <MainViewWrap>
      <div className="flex gap-10">
        <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
          <div className="text-lg pb-4 flex gap-x-2">
            {logo && <div className="h-6 w-6">{logo}</div>}
            <strong>{asset.symbol}</strong>
          </div>
          <div>
            <SingleItemViewGrid item={asset} />
          </div>
        </div>
        {thisAssetPairData?.length && assets && (
          <div className="rounded-md p-8 align-middle justify-items-start shadow-sm">
            <AssetPairTable data={thisAssetPairData} assets={assets} />
          </div>
        )}
      </div>
    </MainViewWrap>
  ) : null;
};

export default Asset;
