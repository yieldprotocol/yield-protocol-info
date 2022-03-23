import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FYToken__factory } from '../contracts';
import { useAppSelector } from '../state/hooks/general';
import { convertValue } from '../state/actions/chain';
import { USDC } from '../config/assets';

interface ITotalDebtItem {
  symbol: string;
  id: string;
  value: number;
}

const useTotalDebt = () => {
  const { provider, series, assets, chainId } = useAppSelector(({ chain }) => chain);
  const { contractMap } = useAppSelector(({ contracts }) => contracts);
  const { prices } = useAppSelector(({ vaults }) => vaults);
  const [loading, setLoading] = useState(false);
  const [totalDebtMap, setTotalDebtMap] = useState<Map<string, ITotalDebtItem>>(new Map());
  const [totalDebtList, setTotalDebtList] = useState<ITotalDebtItem[]>([]); // reduced to unique base debt values
  const [totalDebt, setTotalDebt] = useState<number | undefined>();

  // fetches the total fyTokenBalance for the current chain
  useEffect(() => {
    const _getTotalDebt = async () => {
      try {
        setLoading(true);
        const _totalDebtMap = await Object.values(series!).reduce(async (map, x) => {
          const fyToken = FYToken__factory.connect(x.fyTokenAddress, provider!);
          const fyTokenSupply = await fyToken.totalSupply();
          const fyTokenSupply_ = ethers.utils.formatUnits(fyTokenSupply, x.decimals);
          const base = assets![x.baseId];
          const usdc = assets![USDC];
          const fyTokenToUSDC = await convertValue(fyTokenSupply_, base, usdc, contractMap!, chainId, prices);

          const newMap = await map;
          const currItemValue = newMap.has(base.id) ? newMap.get(base.id)?.value : 0;
          const newItem = {
            id: base.id,
            symbol: base.symbol,
            value: (currItemValue || 0) + +fyTokenToUSDC,
          };
          newMap.set(base.id, newItem);
          return newMap;
        }, Promise.resolve(new Map() as Map<string, ITotalDebtItem>));

        setTotalDebtMap(_totalDebtMap);
        setLoading(false);
      } catch (e) {
        console.log('error getting total debt');
        setLoading(false);
      }
    };
    _getTotalDebt();
  }, [provider, series, assets, chainId, contractMap, prices]);

  useEffect(() => {
    const _totalDebtList = Array.from(totalDebtMap.values());
    setTotalDebtList(_totalDebtList.sort((a, b) => +b.value - +a.value));
    setTotalDebt(_totalDebtList.reduce((total, x) => total + x.value, 0));
  }, [totalDebtMap]);

  return { totalDebt, loading, totalDebtList };
};

export default useTotalDebt;
