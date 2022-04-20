import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FYToken__factory } from '../contracts';
import { useAppSelector } from '../state/hooks/general';
import { convertValue } from '../state/actions/chain';
import { USDC } from '../config/assets';
import { ITotalDebtItem } from '../lib/chain/types';

const useTotalDebt = () => {
  const { provider, series, assets, chainId } = useAppSelector(({ chain }) => chain);
  const { contractMap } = useAppSelector(({ contracts }) => contracts);
  const { prices } = useAppSelector(({ vaults }) => vaults);
  const [loading, setLoading] = useState(false);
  const [totalDebtMap, setTotalDebtMap] = useState<Map<string, ITotalDebtItem>>(new Map());
  const [totalDebtList, setTotalDebtList] = useState<ITotalDebtItem[]>([]); // reduced to unique base debt values
  const [totalDebt, setTotalDebt] = useState<number | undefined>();

  // // fetches the total fyTokenBalance for the current chain
  // useEffect(() => {
  //   const _getTotalDebt = async () => {
  //     if (assets) {
  //       try {
  //         setLoading(true);

  //         setTotalDebtMap(_totalDebtMap);
  //         setLoading(false);
  //       } catch (e) {
  //         console.log('error getting total debt');
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   _getTotalDebt();
  // }, [provider, series, assets, chainId, contractMap, prices]);

  // useEffect(() => {
  //   setTotalDebt(_totalDebtList.reduce((total, x) => total + x.value, 0));
  // }, [totalDebtMap]);

  return { totalDebt, loading, totalDebtList };
};

export default useTotalDebt;
