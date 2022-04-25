import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { formatDistanceStrict } from 'date-fns';
import { burnFromStrategy, SECONDS_PER_YEAR } from '../utils/yieldMath';
import { IStrategy } from '../types/chain';
import * as contracts from '../contracts';
import { getProvider } from '../lib/chain';
import { useAppSelector } from '../state/hooks/general';

/**
 * returns the strategy's corresponding apy estimated based on the base value per share of the current block num and a previous block num (using last 7-8 days)
 * @param strategy
 * @param previousBlocks number of blocks to use for comparison (lookback window)
 */
export const useStrategyReturns = (strategy: IStrategy, previousBlocks: number) => {
  const chainId = useAppSelector(({ application }) => application.chainId);
  const provider = getProvider(chainId);
  const [currentBlock, setCurrentBlock] = useState<number>();
  const [previousBlock, setPreviousBlock] = useState<number>();

  const [strategyReturns, setStrategyReturns] = useState<string | null>(null);
  // number of seconds between comparison timeframe curr and pre
  const [secondsCompare, setSecondsCompare] = useState<number | null>(null);
  const [secondsToDays, setSecondsToDays] = useState<string | null>(null);
  const [previousBlockTimestamp, setPreviousBlockTimestamp] = useState<number>();
  const [currBlockTimestamp, setCurrBlockTimestamp] = useState<number>();

  useEffect(() => {
    (async () => {
      setCurrentBlock(await provider.getBlockNumber());
    })();
  }, [provider]);

  useEffect(() => {
    const _getStrategyBaseValuePerShare = async (blockTag: number) => {
      try {
        const poolContract = contracts.Pool__factory.connect(strategy.poolAddress, provider!);
        const strategyContract = contracts.Strategy__factory.connect(strategy.address, provider!);

        const [[base, fyTokenVirtual], poolTotalSupply, strategyTotalSupply, decimals, fyTokenToBaseCostEstimate] =
          await Promise.all([
            await poolContract.getCache({ blockTag }),
            await poolContract.totalSupply({ blockTag }),
            await strategyContract.totalSupply({ blockTag }),
            await poolContract.decimals({ blockTag }),
            await poolContract.sellFYTokenPreview(
              ethers.utils.parseUnits('1', await poolContract.decimals({ blockTag })),
              {
                blockTag,
              }
            ), // estimate the base value of 1 fyToken unit
          ]);

        // the real balance of fyTokens in the pool
        const fyTokenReal = fyTokenVirtual.sub(poolTotalSupply);

        // the estimated base value of all fyToken in the pool
        const fyTokenToBaseValueEstimate = fyTokenReal
          .mul(fyTokenToBaseCostEstimate)
          .div(ethers.utils.parseUnits('1', decimals));

        // total estimated base value in pool
        const totalBaseValue = base.add(fyTokenToBaseValueEstimate);

        // number of pool lp tokens associated with a strategy
        const poolLpReceived = burnFromStrategy(poolTotalSupply, strategyTotalSupply, strategyTotalSupply);

        // the amount of base per strategy LP token
        const baseValuePerStrategyLpToken =
          (Number(totalBaseValue) / Number(poolTotalSupply)) * (Number(poolLpReceived) / Number(poolTotalSupply));

        return baseValuePerStrategyLpToken;
      } catch (e) {
        console.log('error getting strategy per share value', e);
        return 0;
      }
    };

    /* Compare base per share value for the current block versus the previous to compute apy */
    const _getStrategyReturns = async () => {
      if (strategy && currentBlock && previousBlock && currBlockTimestamp && previousBlockTimestamp) {
        try {
          const baseValuePerShareCurr = await _getStrategyBaseValuePerShare(currentBlock);
          const baseValuePerSharePre = await _getStrategyBaseValuePerShare(previousBlock);
          if ((baseValuePerShareCurr || baseValuePerSharePre) === 0) return 'Could not get returns';

          const returns = baseValuePerShareCurr / baseValuePerSharePre - 1;

          const secondsBetween = currBlockTimestamp - previousBlockTimestamp;
          setSecondsCompare(secondsBetween);
          const periods = SECONDS_PER_YEAR / secondsBetween;

          const apy = (1 + returns / periods) ** periods - 1;
          const apy_ = (apy * 100).toString();
          setStrategyReturns(apy_);
          return apy_;
        } catch (e) {
          console.log(e);
        }
      }
      return 'Could not get returns';
    };
    _getStrategyReturns();
  }, [strategy, currentBlock, previousBlock, currBlockTimestamp, previousBlockTimestamp, provider]);

  /* Get blocks to use for comparison, and corresponding timestamps */
  useEffect(() => {
    (async () => {
      if (currentBlock && provider) {
        try {
          const _preBlock = currentBlock - previousBlocks; // use around 7 days ago timeframe in blocktime
          setPreviousBlock(_preBlock);
          setPreviousBlockTimestamp((await provider.getBlock(_preBlock)).timestamp);
          setCurrBlockTimestamp((await provider.getBlock(currentBlock)).timestamp);
        } catch (e) {
          console.log('could not get timestamps', e);
        }
      }
    })();
  }, [currentBlock, provider, previousBlocks]);

  /* translate the comparison seconds to days */
  useEffect(() => {
    const _secondsToDays = formatDistanceStrict(
      new Date(1, 1, 0, 0, 0, 0),
      new Date(1, 1, 0, 0, 0, secondsCompare || 0),
      {
        unit: 'day',
      }
    );
    setSecondsToDays(_secondsToDays);
  }, [secondsCompare]);

  return { strategyReturns, secondsToDays };
};
