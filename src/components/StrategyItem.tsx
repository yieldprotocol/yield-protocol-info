import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const StrategyItem = ({ item }: any) => (
  <ListItemWrap type="strategies" item={item}>
    <div className="text-sm text-center">
      <strong>{item.name}</strong>
    </div>
  </ListItemWrap>
);

export default StrategyItem;
