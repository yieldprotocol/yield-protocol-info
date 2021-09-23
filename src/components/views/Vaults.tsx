import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import VaultItem from '../VaultItem';
import { useAppSelector } from '../../state/hooks/general';

const Assets = () => {
  const vaults = useAppSelector((st) => st.vaults.vaults);
  const vaultsLoading = useAppSelector((st) => st.chain.vaultsLoading);
  return vaultsLoading ? (
    <ClipLoader loading={vaultsLoading} />
  ) : (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {[...Object.values(vaults)].map((a: any) => (
        <VaultItem item={a} key={a.id} />
      ))}
    </div>
  );
};

export default Assets;
