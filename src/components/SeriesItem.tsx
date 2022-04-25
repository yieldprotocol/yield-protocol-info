import { useState, useEffect } from 'react';
import ListItemWrap from './wraps/ListItemWrap';
import { markMap } from '../config/marks';
import { IAsset, ISeries } from '../types/chain';
import useAssets from '../hooks/useAssets';

const SeriesItem = ({ item }: { item: ISeries }) => {
  const { data: assets } = useAssets();
  const [asset, setAsset] = useState<IAsset>();
  const logo = markMap.get(asset?.symbol!);

  useEffect(() => {
    if (assets) setAsset(assets[item.baseId]);
  }, [assets, item.baseId]);

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
