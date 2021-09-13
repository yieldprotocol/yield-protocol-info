import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const AssetItem = ({ item }: any) => (
  <ListItemWrap type="asset" item={item}>
    <div className="text-sm">
      Symbol: <strong>{item.symbol}</strong>
    </div>
    <div className="text-sm">Id: {item.id}</div>
    <div className="text-sm">Decimals: {item.decimals}</div>
  </ListItemWrap>
);

export default AssetItem;
