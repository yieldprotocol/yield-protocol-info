import { useEffect, useState } from 'react';
import { useAppSelector } from './general';

/* Simple Hook for caching & retrieved data */
export const useBlockNum = () => {
  const { provider } = useAppSelector((st) => st.chain);
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
