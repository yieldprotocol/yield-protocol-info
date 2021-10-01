import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import CopyWrap from '../wraps/CopyWrap';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Vault = () => {
  const { id } = useParams<{ id: string }>();
  const vaults = useAppSelector((st) => st.vaults.vaults);
  const vault = vaults[id];

  return vault ? (
    <MainViewWrap>
      <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
        <div className="text-lg pb-4 flex gap-x-2">
          <CopyWrap value={vault.id}>
            <strong>{vault.id}</strong>
          </CopyWrap>
        </div>
        <SingleItemViewGrid item={vault} />
      </div>
    </MainViewWrap>
  ) : null;
};

export default Vault;
