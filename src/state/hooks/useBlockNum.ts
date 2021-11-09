import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppSelector } from './general';

/* Simple Hook for caching & retrieved data */
export const useBlockNum = () => {
  const provider: ethers.providers.JsonRpcProvider = useAppSelector((st) => st.chain.provider);

  const [blockNum, setBlockNum] = useState<string | null>(null);

  useEffect(() => {
    if (provider) {
      (async () => {
        setBlockNum((await provider.getBlockNumber()).toString());
      })();
    }
  }, [provider]);

  return blockNum;
};
