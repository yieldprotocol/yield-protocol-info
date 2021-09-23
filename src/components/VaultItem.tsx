import React from 'react';
import ListItemWrap from './wraps/ListItemWrap';

const VaultItem = ({ item }: any) => (
  <ListItemWrap type="vaults" item={item}>
    <div className="text-sm text-center">
      <strong>{item.id}</strong>
    </div>
  </ListItemWrap>
);

export default VaultItem;
