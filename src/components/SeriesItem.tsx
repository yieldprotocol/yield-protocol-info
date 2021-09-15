import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const SeriesItem = ({ item }: any) => (
  <ListItemWrap type="series" item={item}>
    <div className="text-sm text-center">
      <strong>{item.name}</strong>
      <div>{item.displayName}</div>
    </div>
  </ListItemWrap>
);

export default SeriesItem;
