import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useVaults from '../../hooks/useVaults';

const DynamicVault = dynamic(() => import('../../components/views/Vault'), { ssr: false });

const VaultPage = () => {
  const router = useRouter();
  const { id: vaultId } = router.query;
  const { data: vaultMap } = useVaults(vaultId);
  if (!vaultMap || !vaultId) return null;

  const vault = vaultMap[vaultId as string];

  return <DynamicVault vault={vault} />;
};

export default VaultPage;
