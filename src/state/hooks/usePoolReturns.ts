import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppSelector } from './general';
import * as contracts from '../../contracts';
import { calcPoolRatios } from '../../utils/yieldMath';
import { ISeries } from '../../types/chain';
import { IContract, IContractMap } from '../../types/contracts';
import { useBlockNum } from './useBlockNum';

export const usePoolReturns = (poolAddress: string, provider: ethers.providers.JsonRpcProvider) => {
  const seriesMap: ISeries = useAppSelector((st) => st.chain.series);
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const Ladle: Contract = Object.values(contractMap).filter((c: IContract) => c.name === 'Ladle')[0].contract;
  const ladleAddress = Ladle.address;
  const series = Object.values(seriesMap).filter((s: ISeries) => s.poolAddress === poolAddress)[0];

  const currentBlock = useBlockNum(); // current block

  const [poolReturns, setPoolReturns] = useState<string | null>(null);
  const [pool, setPool] = useState<Contract>();

  useEffect(() => {
    const _getPoolReturns = async () => {
      if (poolAddress && pool && ladleAddress && series) {
        const [cachedBaseReserves, cachedFyTokenReserves] = await pool.getCache();
        const cachedRealReserves = cachedFyTokenReserves.sub(series.totalSupply);
        const [minRatio, maxRatio] = calcPoolRatios(cachedBaseReserves, cachedRealReserves);

        // burn for base timeframe 1 compared to burn for base timeframe 2 in the future to extrapolate pool returns
        try {
          const blockTag1 = Number(currentBlock) - 1000;
          const transfer = await Ladle.populateTransaction.transfer(poolAddress, poolAddress, 1);
          console.log('transfer', transfer);
          const [tokensBurnedCurr, baseOutCurr] = await pool.callStatic.burnForBase(ladleAddress, minRatio, maxRatio, {
            blockTag: Number(currentBlock),
          });

          const [tokensBurenedPre, baseOutPre] = await pool.callStatic.burnForBase(ladleAddress, minRatio, maxRatio, {
            blockTag: blockTag1,
          });

          const returns = baseOutCurr.sub(baseOutPre).div(baseOutPre);
          setPoolReturns((returns * 100).toString());
          return returns;
        } catch (e) {
          console.log(e);
        }
      }
      return '0';
    };
    _getPoolReturns();
  }, [pool, series, ladleAddress, poolAddress, currentBlock]);

  useEffect(() => {
    const _pool = contracts.Pool__factory.connect(poolAddress, provider);
    _pool && setPool(_pool);
  }, [poolAddress, provider]);

  return poolReturns;
};
