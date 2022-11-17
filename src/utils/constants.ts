import { ethers, BigNumber } from 'ethers';

/* constants */
export const MAX_256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const MAX_128 = '0xffffffffffffffffffffffffffffffff';

export const ZERO_BN = ethers.constants.Zero;
export const ONE_BN = ethers.constants.One;
export const MINUS_ONE_BN = ethers.constants.One.mul(-1);

export const WAD_RAY_BN = BigNumber.from('1000000000000000000000000000');
export const WAD_BN = BigNumber.from('1000000000000000000');

export const SECONDS_PER_YEAR: number = 365 * 24 * 60 * 60;

export const ETH_BYTES = ethers.utils.formatBytes32String('ETH-A');
export const CHAI_BYTES = ethers.utils.formatBytes32String('CHAI');

export const CHI = ethers.utils.formatBytes32String('chi');
export const RATE = ethers.utils.formatBytes32String('rate');

export const BLANK_VAULT = '0x000000000000000000000000';
export const BLANK_SERIES = '0x000000000000';

// contract names
export const POOLVIEW = 'PoolView';
export const CAULDRON = 'Cauldron';
export const LADLE = 'Ladle';
export const WITCH = 'Witch';
export const WITCH_V1 = 'WitchV1';
export const COMPOUND_MULTI_ORACLE = 'CompoundMultiOracle';
export const CHAINLINK_MULTI_ORACLE = 'ChainlinkMultiOracle';
export const COMPOSITE_MULTI_ORACLE = 'CompositeMultiOracle';
export const CHAINLINK_USD_ORACLE = 'ChainlinkUSDOracle';

// localStorage settings
export const CHAIN_ID_LOCAL_STORAGE = 'yield-protocol-info-chainId';
export const THEME_KEY = 'yield-protocol-info-theme';
