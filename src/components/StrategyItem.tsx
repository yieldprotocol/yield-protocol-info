import React, { FC } from 'react';
import ListItemWrap from './wraps/ListItemWrap';
import { markMap } from '../config/marks';
import { useAppSelector } from '../state/hooks/general';
import { IStrategy } from '../types/chain';

const StrategyItem: FC<{ item: IStrategy }> = ({ item }) => {
  const { assets } = useAppSelector(({ chain }) => chain);
  const asset = assets ? assets![item.baseId] : null;
  const logo = markMap.get(asset?.symbol!);

  return (
    <ListItemWrap type="strategies" item={item}>
      <div className="flex text-sm text-center gap-2">
        {logo && <div className="h-5 w-5">{logo}</div>}
        <strong>{item.name}</strong>
      </div>
    </ListItemWrap>
  );
};
export default StrategyItem;
