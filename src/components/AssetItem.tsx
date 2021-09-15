import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const AssetItem = ({ item }: any) => (
  <ListItemWrap type="assets" item={item}>
    <div className="text-sm">
      <strong>{item.symbol}</strong>
    </div>
    <div className="text-sm">Id: {item.id}</div>
  </ListItemWrap>
);

export default AssetItem;
