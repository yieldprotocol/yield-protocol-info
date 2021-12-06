import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVaults } from '../../state/actions/vaults';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { IVault } from '../../types/vaults';
import Spinner from '../Spinner';
import CopyWrap from '../wraps/CopyWrap';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Vault: FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { vaults, vaultsLoading } = useAppSelector((st) => st.vaults);
  const [vault, setVault] = useState<IVault | undefined>();

  useEffect(() => {
    if (vaults && vaults[id]) setVault(vaults[id]);
  }, [vaults, id, dispatch]);

  useEffect(() => {
    if (!vaults || !vaults[id]) dispatch(getVaults());
  }, [vaults, dispatch, id]);

  return vault ? (
    <MainViewWrap>
      {vaultsLoading ? (
        <Spinner loading={vaultsLoading} />
      ) : (
        <div className="rounded-lg p-8 align-middle justify-items-start shadow-md dark:bg-green-400 bg-green-100">
          <div className="text-lg pb-4 flex gap-x-2">
            <CopyWrap value={vault.id}>
              <strong>{vault.id}</strong>
            </CopyWrap>
          </div>
          <SingleItemViewGrid item={vault} />
        </div>
      )}
    </MainViewWrap>
  ) : null;
};

export default Vault;
