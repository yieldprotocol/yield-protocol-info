import { ethers } from 'ethers';
import { ORACLE_INFO } from '../../config/oracles';
import { IContractMap } from '../../types/contracts';
import { bytesToBytes32 } from '../../utils/appUtils';
import { WAD_BN } from '../../utils/constants';
import { decimal18ToDecimalN } from '../../utils/yieldMath';

export const getPrice = async (
  ilk: string,
  base: string,
  contractMap: IContractMap,
  decimals: number = 18,
  chainId: number
) => {
  const oracleName = ORACLE_INFO.get(chainId)?.get(base)?.get(ilk);
  const Oracle = contractMap[oracleName!];

  try {
    const [price] = await Oracle.peek(
      bytesToBytes32(ilk, 6),
      bytesToBytes32(base, 6),
      decimal18ToDecimalN(WAD_BN, decimals)
    );
    return price;
  } catch (e) {
    return ethers.constants.Zero;
  }
};
