import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Asset = () => {
  const { id } = useParams<{ id: string }>();
  const assets = useAppSelector((st) => st.chain.assets);
  const asset = assets[id];

  return asset ? (
    <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-md pb-4">
        <strong>{asset.symbol}</strong>
      </div>
      <SingleItemViewGrid item={asset} />
    </div>
  ) : null;
};

export default Asset;
