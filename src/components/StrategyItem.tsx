import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const StrategyItem = ({ item }: any) => (
  <ListItemWrap type="strategies" item={item}>
    <div className="text-sm">
      <strong>{item.name}</strong>
    </div>
  </ListItemWrap>
);

export default StrategyItem;
