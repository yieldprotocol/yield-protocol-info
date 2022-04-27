import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ISeries } from '../types/chain';
import * as contracts from '../contracts';
import { getProvider } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';
import useContracts from './useContracts';
import { POOLVIEW } from '../utils/constants';
import { buyBase, calculateAPR, sellBase } from '../utils/yieldMath';
import { cleanValue } from '../utils/appUtils';

export const useSeriesReturns = (series: ISeries) => {
  const contractMap = useContracts();
  const chainId = useAppSelector(({ application }) => application.chainId);
  const provider = getProvider(chainId);
  const NOW = Math.round(new Date().getTime() / 1000);

  // pool state
  const [seriesReturns, setSeriesReturns] = useState<string>();
  const [feesAPR, setFeesAPR] = useState<string>();
  const [fyTokenPoolAPR, setFyTokenPoolAPR] = useState<string>();

  /* Calculate returns using alternative method (calc fees annualized + current fyToken interest annualized) */
  useEffect(() => {
    const poolContract = contracts.Pool__factory.connect(series.poolAddress, provider);
    const poolViewContract = contractMap[POOLVIEW] as contracts.PoolView;

    /**
     * calculate the fees portion of the total apr
     * calculated by taking the current invariant relative to the initial invariant at pool launch
     * extrapolates an apr based on the time between now and the pool launch
     * @returns number
     */
    const calcAnnualizedFees = async () => {
      const currentInvariant = await poolViewContract.invariant(series.poolAddress);
      const initInvariant = ethers.utils.parseUnits('1', 18);
      const firstEvent = (await poolContract.queryFilter('Sync' as ethers.EventFilter))[0];
      const blockTimestamp = (await firstEvent.getBlock()).timestamp;

      return +calculateAPR(initInvariant, currentInvariant, NOW, blockTimestamp);
    };

    /**
     * calculate the fyToken interest portion of the total apr
     * derived by calculating the ratio of fyToken in the pool, and multiplying by the current avg lend/borrow apr
     * @returns Promise<number>
     */
    const calcAnnualizedFyTokenInterest = async () => {
      const [baseReserves, fyTokenVirtual, poolTotalSupply, ts, g1, g2] = await Promise.all([
        poolContract.getBaseBalance(),
        poolContract.getFYTokenBalance(),
        poolContract.totalSupply(),
        poolContract.ts(),
        poolContract.g1(),
        poolContract.g2(),
      ]);

      const fyTokenReal = fyTokenVirtual.sub(poolTotalSupply);
      const totalBalance = baseReserves.add(fyTokenReal);
      const fyTokenToTotalRatio = +fyTokenReal / +totalBalance;
      const timeTillMaturity = series.maturity - NOW;

      // estimate the fyToken interest rate by taking the ratio of fyToken in the pool to total balance (base + fyToken) and multiplying by the current lend apr
      const baseAmount = ethers.utils.parseUnits('1', series.decimals); // used to estimate the lend apr
      const lendPreview = sellBase(
        baseReserves,
        fyTokenVirtual,
        baseAmount,
        timeTillMaturity.toString(),
        ts,
        g1,
        series.decimals
      );
      const borrowPreview = buyBase(
        baseReserves,
        fyTokenVirtual,
        baseAmount,
        timeTillMaturity.toString(),
        ts,
        g2,
        series.decimals
      );
      const lendAPR = calculateAPR(baseAmount, lendPreview, series.maturity);
      const borrowAPR = calculateAPR(baseAmount, borrowPreview, series.maturity);
      const avgAPR = (+lendAPR + +borrowAPR) / 2;

      return +fyTokenToTotalRatio.toString() * +avgAPR;
    };

    const calcPoolReturns = async () => {
      const _feesAPR = await calcAnnualizedFees();
      setFeesAPR(cleanValue(_feesAPR.toString(), 2));

      const _fyTokenPoolAPR = await calcAnnualizedFyTokenInterest();
      setFyTokenPoolAPR(cleanValue(_fyTokenPoolAPR.toString(), 2));

      const res = cleanValue((_feesAPR + _fyTokenPoolAPR).toString(), 2);
      setSeriesReturns(res);
    };

    calcPoolReturns();
  }, [contractMap, series.decimals, series.maturity, series.poolAddress]);

  return { seriesReturns, feesAPR, fyTokenPoolAPR };
};
