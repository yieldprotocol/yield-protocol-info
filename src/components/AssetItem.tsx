import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';
import { markMap } from '../config/marks';
import { useAppSelector } from '../state/hooks/general';

const AssetItem = ({ item }: any) => {
  const assets = useAppSelector((st) => st.chain.assets);
  const asset = assets[item.id];
  const logo = markMap?.get(asset?.symbol);
  return (
    <ListItemWrap type="assets" item={item}>
      <div className="flex text-sm text-center gap-2">
        {logo && <div className="h-5 w-5">{logo}</div>}
        <strong>{item.symbol}</strong>
      </div>
    </ListItemWrap>
  );
};

export default AssetItem;
