import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const AssetItem = ({ item }: any) => (
  <ListItemWrap type="assets" item={item}>
    <div className="text-sm text-center">
      <strong>{item.symbol}</strong>
    </div>
  </ListItemWrap>
);

export default AssetItem;
