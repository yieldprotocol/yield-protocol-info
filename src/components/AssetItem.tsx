import ListItemWrap from './wraps/ListItemWrap';
import { markMap } from '../config/marks';
import { IAsset } from '../types/chain';

const AssetItem = ({ item }: { item: IAsset }) => {
  const logo = markMap.get(item.symbol);
  return (
    <ListItemWrap type="assets" item={item}>
      <div className="flex text-sm text-center gap-2">
        {logo && <div className="h-5 w-5">{logo}</div>}
        <strong>{item.symbol}</strong>
      </div>
    </ListItemWrap>
  );
};

export default AssetItem;
