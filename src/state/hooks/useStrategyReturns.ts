import { useEffect, useState } from 'react';
import { BigNumber, Contract, ethers } from 'ethers';
import { formatDistanceStrict } from 'date-fns';
import { useBlockNum } from './useBlockNum';
import { burnFromStrategy, SECONDS_PER_YEAR } from '../../utils/yieldMath';
import { useAppSelector } from './general';
import { IStrategy } from '../../types/chain';
import * as contracts from '../../contracts';

/**
 * returns the strategy's corresponding apy estimated based on the base value per share of the current block num and a previous block num (using last 7-8 days)
 * @param strategy
 * @param previousBlocks number of blocks to use for comparison (lookback window)
 */
export const useStrategyReturns = (strategy: IStrategy, previousBlocks: number) => {
  const provider: ethers.providers.JsonRpcProvider = useAppSelector((st) => st.chain.provider);
  const currentBlock: number | null = useBlockNum();
  const [previousBlock, setPreviousBlock] = useState<number>();

  const [strategyReturns, setStrategyReturns] = useState<string | null>(null);
  // number of seconds between comparison timeframe curr and pre
  const [secondsCompare, setSecondsCompare] = useState<number | null>(null);
  const [secondsToDays, setSecondsToDays] = useState<string | null>(null);
  const [previousBlockTimestamp, setPreviousBlockTimestamp] = useState<any>();
  const [currBlockTimestamp, setCurrBlockTimestamp] = useState<any>();

  useEffect(() => {
    const _getStrategyBaseValuePerShare = async (blockNum: number) => {
      try {
        const poolContract: Contract = contracts.Pool__factory.connect(strategy.poolAddress, provider);
        const strategyContract: Contract = contracts.Strategy__factory.connect(strategy.address, provider);

        const [[base, fyTokenVirtual], poolTotalSupply, strategyTotalSupply, decimals, fyTokenToBaseCostEstimate] =
          await Promise.all([
            await poolContract.getCache({ blockTag: blockNum }),
            await poolContract.totalSupply({ blockTag: blockNum }),
            await strategyContract.totalSupply({ blockTag: blockNum }),
            await poolContract.decimals({ blockTag: blockNum }),
            await poolContract.sellFYTokenPreview(
              BigNumber.from(1).mul(BigNumber.from(10).pow(await poolContract.decimals())),
              {
                blockTag: blockNum,
              }
            ), // estimate the base value of 1 fyToken unit
          ]);

        // the real balance of fyTokens in the pool
        const fyTokenReal: BigNumber = (fyTokenVirtual as BigNumber).sub(poolTotalSupply as BigNumber);

        // the estimated base value of all fyToken in the pool
        const fyTokenToBaseValueEstimate: BigNumber = fyTokenReal
          .mul(fyTokenToBaseCostEstimate)
          .div(BigNumber.from(1).mul(BigNumber.from(10).pow(decimals)));

        // total estimated base value in pool
        const totalBaseValue: BigNumber = base.add(fyTokenToBaseValueEstimate);

        // number of pool lp tokens associated with a strategy
        const poolLpReceived: BigNumber = burnFromStrategy(poolTotalSupply, strategyTotalSupply, strategyTotalSupply);

        // the amount of base per strategy LP token
        const baseValuePerStrategyLpToken: number =
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
          const baseValuePerShareCurr: number = await _getStrategyBaseValuePerShare(Number(currentBlock));
          const baseValuePerSharePre: number = await _getStrategyBaseValuePerShare(Number(previousBlock));

          const returns: number = Number(baseValuePerShareCurr) / Number(baseValuePerSharePre) - 1;

          const secondsBetween: number = currBlockTimestamp - previousBlockTimestamp;
          setSecondsCompare(secondsBetween);
          const periods: number = SECONDS_PER_YEAR / secondsBetween;

          const apy: number = (1 + returns / periods) ** periods - 1;
          const apy_: string = (apy * 100).toString();
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
          const _preBlock: number = Number(currentBlock) - previousBlocks; // use around 7 days ago timeframe in blocktime
          setPreviousBlock(_preBlock);
          setPreviousBlockTimestamp((await provider.getBlock(Number(_preBlock))).timestamp);
          setCurrBlockTimestamp((await provider.getBlock(Number(currentBlock))).timestamp);
        } catch (e) {
          console.log('could not get timestamps', e);
        }
      }
    })();
  }, [currentBlock, provider, previousBlocks]);

  /* translate the comparison seconds to days */
  useEffect(() => {
    const _secondsToDays: string = formatDistanceStrict(
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
