import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const StrategyItem = ({ item }: any) => (
  <ListItemWrap type="strategies" item={item}>
    <div className="text-sm">
      Strategy: <strong>{item.name}</strong>
    </div>
    <div className="text-sm">Symbol: {item.symbol}</div>
    <div className="text-sm">Base Id: {item.baseId}</div>
    <div className="text-sm">Decimals: {item.decimals}</div>
  </ListItemWrap>
);

export default StrategyItem;
