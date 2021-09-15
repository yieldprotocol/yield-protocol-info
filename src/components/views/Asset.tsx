import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import { markMap } from '../../config/marks';

const Asset = () => {
  const { id } = useParams<{ id: string }>();
  const assets = useAppSelector((st) => st.chain.assets);
  const asset = assets[id];
  const logo = markMap?.get(asset?.symbol);

  return asset ? (
    <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-lg pb-4 flex gap-x-2">
        {logo && <div className="h-6 w-6">{logo}</div>}
        <strong>{asset.symbol}</strong>
      </div>
      <SingleItemViewGrid item={asset} />
    </div>
  ) : null;
};

export default Asset;
