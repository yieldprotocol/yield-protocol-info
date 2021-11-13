import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppSelector } from './general';

/* Simple Hook for caching & retrieved data */
export const useBlockNum = () => {
  const provider: ethers.providers.JsonRpcProvider = useAppSelector((st) => st.chain.provider);

  const [blockNum, setBlockNum] = useState<number | null>(null);

  useEffect(() => {
    if (provider) {
      (async () => {
        try {
          setBlockNum(await provider.getBlockNumber());
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [provider]);

  return blockNum;
};
