import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';

const Asset = () => {
  const { id } = useParams<{ id: string }>();
  const assets = useAppSelector((st) => st.chain.assets);
  const asset = assets[id];

  return asset ? (
    <div className="rounded-md p-5 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-sm">
        <strong>{asset.symbol}</strong>
      </div>
      {Object.entries(asset).map((key: any, val: any) => (
        <div className="text-sm" key={key}>
          {key}: {val}
        </div>
      ))}
    </div>
  ) : null;
};

export default Asset;
