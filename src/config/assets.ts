import { ethers } from 'ethers';

export const WETH = '0x303000000000';
export const DAI = '0x303100000000';
export const USDC = '0x303200000000';
export const WBTC = '0x303300000000';
export const stETH = '0x303400000000';
export const wstETH = '0x303500000000';
export const LINK = '0x303600000000';
export const ENS = '0x303700000000';

export const UNI = '0x313000000000';

export const ETH_BASED_ASSETS = ['WETH', 'ETH', WETH, ethers.utils.formatBytes32String('ETH').slice(0, 14)];
export const DAI_PERMIT_ASSETS = ['DAI', DAI];
export const NON_PERMIT_ASSETS = ['WBTC', 'LINK', WBTC, LINK];

export const IGNORE_BASE_ASSETS = ['ETH', 'WETH', WETH];
