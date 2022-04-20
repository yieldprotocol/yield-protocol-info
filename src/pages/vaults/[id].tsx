import { useRouter } from 'next/router';
import Vault from '../../components/views/Vault';
import useVaults from '../../hooks/useVaults';

const VaultPage = () => {
  const vaultMap = useVaults();
  const router = useRouter();
  const { id: vaultId } = router.query;
  if (!vaultMap || !vaultId) return null;

  const vault = vaultMap[vaultId as string];

  return <Vault vault={vault} />;
};

export default VaultPage;
