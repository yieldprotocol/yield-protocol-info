import { useEffect, useState } from 'react';
import { BigNumber, Contract, ethers } from 'ethers';
import { formatDistanceStrict } from 'date-fns';
import { useAppSelector } from './general';
import * as contracts from '../../contracts';
import { ISeries } from '../../types/chain';
import { IContract, IContractMap } from '../../types/contracts';
import { useBlockNum } from './useBlockNum';
import { SECONDS_PER_YEAR } from '../../utils/yieldMath';

export const usePoolReturns = (poolAddress: string, provider: ethers.providers.JsonRpcProvider) => {
  const seriesMap: ISeries = useAppSelector((st) => st.chain.series);
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const Ladle: Contract = Object.values(contractMap).filter((c: IContract) => c.name === 'Ladle')[0].contract;
  const ladleAddress = Ladle.address;
  const series = Object.values(seriesMap).filter((s: ISeries) => s.poolAddress === poolAddress)[0];

  const currentBlock = useBlockNum(); // current block

  const [poolReturns, setPoolReturns] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<string | null>(null);
  const [currPool, setCurrPool] = useState<contracts.Pool>();
  const [previousBlock, setPreviousBlock] = useState<number>();
  const [previousBlockTimestamp, setPreviousBlockTimestamp] = useState<any>();
  const [currBlockTimestamp, setCurrBlockTimestamp] = useState<any>();

  useEffect(() => {
    const _getPoolBaseValuePerShare = async (pool: contracts.Pool, blockNum: number) => {
      try {
        const [base, fyTokenVirtual] = await pool.getCache({ blockTag: blockNum });
        const totalSupply = await pool.totalSupply({ blockTag: blockNum });
        const decimals = await pool.decimals({ blockTag: blockNum });
        const fyTokenToBaseCostEstimate = await pool.sellFYTokenPreview(
          BigNumber.from(1).mul(BigNumber.from(10).pow(decimals)),
          { blockTag: blockNum }
        ); // estimate the base value of 1 fyToken unit

        const fyTokenReal = (fyTokenVirtual as BigNumber).sub(totalSupply as BigNumber);

        const fyTokenToBaseValueEstimate = fyTokenReal
          .mul(fyTokenToBaseCostEstimate)
          .div(BigNumber.from(1).mul(BigNumber.from(10).pow(decimals)));

        const totalValue = base.add(fyTokenToBaseValueEstimate);

        const valuePerShare_ = Number(totalValue.toString()) / Number(totalSupply.toString());
        return valuePerShare_;
      } catch (e) {
        console.log('error getting pool per share value', e);
        return [ethers.constants.Zero, ethers.constants.Zero];
      }
    };

    const _getPoolReturns = async () => {
      if (currPool && ladleAddress && series && currentBlock && previousBlock) {
        // burn for base timeframe 1 compared to burn for base timeframe 2 in the future to extrapolate pool returns
        try {
          const baseValueTimeframeCurr = await _getPoolBaseValuePerShare(currPool, Number(currentBlock));
          const baseValueTimeframePre = await _getPoolBaseValuePerShare(currPool, Number(previousBlock));

          const returns = Number(baseValueTimeframeCurr) / Number(baseValueTimeframePre);
          const secondsBetween = currBlockTimestamp - previousBlockTimestamp;
          const periods = SECONDS_PER_YEAR / secondsBetween;
          const secondsToDays = formatDistanceStrict(
            new Date(1, 1, 0, 0, 0, 0),
            new Date(1, 1, 0, 0, 0, secondsBetween || 0),
            { unit: 'day' }
          );
          setTimeframe(secondsToDays);
          const _apr = (1 + returns / periods) ** periods - 1;
          setPoolReturns(_apr);
          return _apr;
        } catch (e) {
          console.log(e);
        }
      }
      return 0;
    };
    _getPoolReturns();
  }, [
    currPool,
    series,
    ladleAddress,
    poolAddress,
    currentBlock,
    previousBlock,
    currBlockTimestamp,
    previousBlockTimestamp,
  ]);

  useEffect(() => {
    const _pool: contracts.Pool = contracts.Pool__factory.connect(poolAddress, provider);
    _pool && setCurrPool(_pool);
  }, [poolAddress, provider]);

  useEffect(() => {
    (async () => {
      if (currentBlock) {
        const _preBlock = Number(currentBlock) - 50000; // use around 7-8 days ago timeframe in blocktime
        setPreviousBlock(_preBlock);
        setPreviousBlockTimestamp((await provider.getBlock(_preBlock)).timestamp);
        setCurrBlockTimestamp((await provider.getBlock(currentBlock)).timestamp);
      }
    })();
  }, [currentBlock, provider]);

  return { poolReturns, timeframe };
};
