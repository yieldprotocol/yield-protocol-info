import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const SeriesItem = ({ item }: any) => (
  <ListItemWrap type="series" item={item}>
    <div className="text-sm">
      <strong>{item.name}</strong>
    </div>
    <div className="text-sm">Base Id: {item.baseId}</div>
    <div className="text-sm">Decimals: {item.decimals}</div>
  </ListItemWrap>
);

export default SeriesItem;
