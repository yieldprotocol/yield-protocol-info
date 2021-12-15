import React, { FC, useState, useEffect } from 'react';
import ListItemWrap from './wraps/ListItemWrap';
import { markMap } from '../config/marks';
import { useAppSelector } from '../state/hooks/general';
import { IAsset, ISeries } from '../types/chain';

const SeriesItem: FC<{ item: ISeries }> = ({ item }) => {
  const { assets } = useAppSelector((st) => st.chain);
  const [asset, setAsset] = useState<IAsset>();
  const logo = markMap.get(asset?.symbol!);

  useEffect(() => {
    if (assets) setAsset(assets[item.baseId]);
  }, []);

  return (
    <ListItemWrap type="series" item={item}>
      <div className="flex text-sm text-center gap-2">
        {logo && <div className="h-5 w-5">{logo}</div>}
        <strong>{item.displayName}</strong>
      </div>
    </ListItemWrap>
  );
};

export default SeriesItem;
