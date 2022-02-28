import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FYToken__factory } from '../contracts';
import { useAppSelector } from '../state/hooks/general';
import { convertValue } from '../state/actions/chain';
import { USDC } from '../config/assets';

const useTotalDebt = () => {
  const { provider, series, assets, chainId } = useAppSelector(({ chain }) => chain);
  const { contractMap } = useAppSelector(({ contracts }) => contracts);
  const { prices } = useAppSelector(({ vaults }) => vaults);
  const [loading, setLoading] = useState(false);
  const [totalDebt, setTotalDebt] = useState<number | undefined>();

  // fetches the total fyTokenBalance for the current chain
  useEffect(() => {
    const _getTotalDebt = async () => {
      setLoading(true);
      try {
        const _totalFyTokenBalance = await Object.values(series!).reduce(async (total, x) => {
          const fyToken = FYToken__factory.connect(x.fyTokenAddress, provider!);
          const fyTokenSupply = await fyToken.totalSupply();
          const fyTokenSupply_ = ethers.utils.formatUnits(fyTokenSupply, x.decimals);
          const fyTokenToUSDC = await convertValue(
            fyTokenSupply_,
            assets![x.baseId],
            assets![USDC],
            contractMap!,
            chainId,
            prices
          );
          return (await total) + +fyTokenToUSDC;
        }, Promise.resolve(0));

        setTotalDebt(_totalFyTokenBalance);
        setLoading(false);
      } catch (e) {
        console.log('error getting total debt');
        setTotalDebt(undefined);
        setLoading(false);
      }
    };
    _getTotalDebt();
  }, [provider, series, assets, chainId, contractMap, prices]);

  return { totalDebt, loading };
};

export default useTotalDebt;
