import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppSelector } from './general';

/* Simple Hook for caching & retrieved data */
export const useEnsName = (account: string) => {
  const provider = useAppSelector((st) => st.chain.provider);
  const chainId = useAppSelector((st) => st.chain.chainId);
  const [ensName, setEnsName] = useState<string | null>(null);

  useEffect(() => {
    if (provider && chainId === 1 && ethers.utils.isAddress(account)) {
      (async () => {
        setEnsName(await provider.lookupAddress(account));
      })();
    }
  }, [account, provider, chainId]);

  return ensName;
};
