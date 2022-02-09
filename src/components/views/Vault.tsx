import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMainnetVaults, getNotMainnetVaults } from '../../state/actions/vaults';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { IVault } from '../../types/vaults';
import Spinner from '../Spinner';
import CopyWrap from '../wraps/CopyWrap';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Vault: FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { chainId } = useAppSelector(({ chain }) => chain);
  const { vaults, vaultsLoading } = useAppSelector((st) => st.vaults);
  const [vault, setVault] = useState<IVault | undefined>();

  useEffect(() => {
    if (vaults && vaults[id]) setVault(vaults[id]);
  }, [vaults, id, dispatch]);

  useEffect(() => {
    if (!vaults || (!vaults[id] && chainId === 1)) dispatch(getMainnetVaults());
    if (!vaults || (!vaults[id] && chainId !== 1)) dispatch(getNotMainnetVaults());
  }, [vaults, dispatch, id, chainId]);

  return (
    <MainViewWrap>
      {vaultsLoading && <Spinner loading={vaultsLoading} />}
      {vault && (
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
  );
};

export default Vault;
