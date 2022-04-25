import ListItemWrap from './wraps/ListItemWrap';
import { markMap } from '../config/marks';
import { IStrategy } from '../types/chain';
import useAssets from '../hooks/useAssets';

const StrategyItem = ({ item }: { item: IStrategy }) => {
  const { data: assets } = useAssets();
  const asset = assets ? assets[item.baseId] : undefined;
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
