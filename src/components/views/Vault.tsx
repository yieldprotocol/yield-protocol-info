import { IVault } from '../../types/vaults';
import CopyWrap from '../wraps/CopyWrap';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Vault = ({ vault }: { vault: IVault }) => (
  <MainViewWrap>
    <div className="rounded-lg p-8 align-middle justify-items-start shadow-md dark:bg-green-400 bg-green-100">
      <div className="text-lg pb-4 flex gap-x-2">
        <CopyWrap value={vault.id}>
          <strong>{vault.id}</strong>
        </CopyWrap>
      </div>
      <SingleItemViewGrid item={vault} />
    </div>
  </MainViewWrap>
);

export default Vault;
