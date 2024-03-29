import {
  WETH,
  DAI,
  USDC,
  WBTC,
  USDT,
  stETH,
  wstETH,
  ENS,
  LINK,
  UNI,
  yvUSDC,
  MKR,
  FUSDC2203,
  FDAI2203,
  FUSDC2206,
  FDAI2206,
  FUSDC2209,
  FDAI2209,
  FRAX,
  CVX3CRV,
  FUSDC2212,
  FUSDC2303,
  FDAI2212,
  FDAI2303,
  FETH2212,
  FETH2303,
} from './assets';

const COMPOSITE_MULTI_ORACLE = 'CompositeMultiOracle';
const CHAINLINK_MULTI_ORACLE = 'ChainlinkMultiOracle';
const YEARNVAULT_MULTI_ORACLE = 'YearnVaultMultiOracle';
const CHAINLINK_USD_ORACLE = 'ChainlinkUSDOracle';
const NOTIONAL_MULTI_ORACLE = 'NotionalMultiOracle';

// map chain id to oracle info
export const ORACLE_INFO = new Map<number, Map<string, Map<string, string>>>();

// map asset (quote) and other asset (base) to a specific oracle based on where there is relevant price info for the pair
export const CHAIN_ID_1_ASSET_ORACLE_INFO = new Map<string, Map<string, string>>();
export const CHAIN_ID_4_ASSET_ORACLE_INFO = new Map<string, Map<string, string>>();
export const CHAIN_ID_42_ASSET_ORACLE_INFO = new Map<string, Map<string, string>>();
export const CHAIN_ID_42161_ASSET_ORACLE_INFO = new Map<string, Map<string, string>>();
export const CHAIN_ID_421611_ASSET_ORACLE_INFO = new Map<string, Map<string, string>>();

/* chain id 1, 4, 5, 42 (these chain id's all use the same oracle contracts) */
// USDC base
const usdcIlkOracle1 = new Map<string, string>();
usdcIlkOracle1.set(WETH, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(DAI, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(USDC, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(WBTC, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(stETH, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(wstETH, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(ENS, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(LINK, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(UNI, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(yvUSDC, YEARNVAULT_MULTI_ORACLE);
usdcIlkOracle1.set(MKR, COMPOSITE_MULTI_ORACLE);
usdcIlkOracle1.set(FRAX, CHAINLINK_MULTI_ORACLE);
usdcIlkOracle1.set(USDT, CHAINLINK_MULTI_ORACLE);
/* notional additions */
usdcIlkOracle1.set(FUSDC2203, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(FUSDC2206, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(FUSDC2209, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(FUSDC2212, NOTIONAL_MULTI_ORACLE);
usdcIlkOracle1.set(FUSDC2303, NOTIONAL_MULTI_ORACLE);
/* convex */
usdcIlkOracle1.set(CVX3CRV, COMPOSITE_MULTI_ORACLE);

CHAIN_ID_1_ASSET_ORACLE_INFO.set(USDC, usdcIlkOracle1);

// DAI base
const daiIlkOracle1 = new Map<string, string>();
daiIlkOracle1.set(WETH, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(DAI, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(USDC, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(WBTC, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(stETH, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(wstETH, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(ENS, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(LINK, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(UNI, CHAINLINK_MULTI_ORACLE);
daiIlkOracle1.set(yvUSDC, YEARNVAULT_MULTI_ORACLE);
daiIlkOracle1.set(MKR, COMPOSITE_MULTI_ORACLE);
daiIlkOracle1.set(FRAX, COMPOSITE_MULTI_ORACLE);
/* notional additions */
daiIlkOracle1.set(FDAI2203, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(FDAI2206, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(FDAI2209, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(FDAI2212, NOTIONAL_MULTI_ORACLE);
daiIlkOracle1.set(FDAI2303, NOTIONAL_MULTI_ORACLE);
/* convex */
daiIlkOracle1.set(CVX3CRV, COMPOSITE_MULTI_ORACLE);

CHAIN_ID_1_ASSET_ORACLE_INFO.set(DAI, daiIlkOracle1);

// WETH base
const wethIlkOracle1 = new Map<string, string>();
wethIlkOracle1.set(WETH, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(DAI, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(USDC, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(WBTC, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(stETH, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(wstETH, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(ENS, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(LINK, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(UNI, CHAINLINK_MULTI_ORACLE);
wethIlkOracle1.set(yvUSDC, YEARNVAULT_MULTI_ORACLE);
wethIlkOracle1.set(MKR, COMPOSITE_MULTI_ORACLE);
wethIlkOracle1.set(FRAX, COMPOSITE_MULTI_ORACLE);
CHAIN_ID_1_ASSET_ORACLE_INFO.set(WETH, wethIlkOracle1);
/* notional additions */
wethIlkOracle1.set(FETH2212, NOTIONAL_MULTI_ORACLE);
wethIlkOracle1.set(FETH2303, NOTIONAL_MULTI_ORACLE);

// FRAX base
const fraxIlkOracle1 = new Map<string, string>();
fraxIlkOracle1.set(WETH, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(DAI, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(USDC, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(WBTC, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(stETH, COMPOSITE_MULTI_ORACLE);
fraxIlkOracle1.set(wstETH, COMPOSITE_MULTI_ORACLE);
fraxIlkOracle1.set(ENS, COMPOSITE_MULTI_ORACLE);
fraxIlkOracle1.set(LINK, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(UNI, CHAINLINK_MULTI_ORACLE);
fraxIlkOracle1.set(yvUSDC, YEARNVAULT_MULTI_ORACLE);
fraxIlkOracle1.set(MKR, COMPOSITE_MULTI_ORACLE);
CHAIN_ID_1_ASSET_ORACLE_INFO.set(FRAX, fraxIlkOracle1);

// USDT base
const usdtIlkOracle1 = new Map<string, string>();
usdtIlkOracle1.set(WETH, CHAINLINK_MULTI_ORACLE);
usdtIlkOracle1.set(DAI, CHAINLINK_MULTI_ORACLE);
usdtIlkOracle1.set(USDC, CHAINLINK_MULTI_ORACLE);
usdtIlkOracle1.set(WBTC, CHAINLINK_MULTI_ORACLE);
usdtIlkOracle1.set(stETH, COMPOSITE_MULTI_ORACLE);
usdtIlkOracle1.set(wstETH, COMPOSITE_MULTI_ORACLE);
usdtIlkOracle1.set(ENS, COMPOSITE_MULTI_ORACLE);
usdtIlkOracle1.set(LINK, CHAINLINK_MULTI_ORACLE);
usdtIlkOracle1.set(UNI, CHAINLINK_MULTI_ORACLE);
usdtIlkOracle1.set(yvUSDC, YEARNVAULT_MULTI_ORACLE);
usdtIlkOracle1.set(MKR, COMPOSITE_MULTI_ORACLE);
CHAIN_ID_1_ASSET_ORACLE_INFO.set(USDT, usdtIlkOracle1);

/* chain id 42161, 421611 (aribtrum mainnet and arbitrum rinkeby use the same oracle contracts) */

// USDC base
const usdcIlkOracle421611 = new Map<string, string>();
usdcIlkOracle421611.set(WETH, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(DAI, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(USDC, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(WBTC, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(stETH, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(wstETH, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(ENS, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(LINK, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(UNI, CHAINLINK_USD_ORACLE);
usdcIlkOracle421611.set(yvUSDC, YEARNVAULT_MULTI_ORACLE);
usdcIlkOracle421611.set(MKR, CHAINLINK_USD_ORACLE);
CHAIN_ID_421611_ASSET_ORACLE_INFO.set(USDC, usdcIlkOracle421611);

// DAI base
const daiIlkOracle421611 = new Map<string, string>();
daiIlkOracle421611.set(WETH, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(DAI, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(USDC, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(WBTC, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(stETH, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(wstETH, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(ENS, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(LINK, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(UNI, CHAINLINK_USD_ORACLE);
daiIlkOracle421611.set(yvUSDC, YEARNVAULT_MULTI_ORACLE);
daiIlkOracle421611.set(MKR, CHAINLINK_USD_ORACLE);

CHAIN_ID_421611_ASSET_ORACLE_INFO.set(DAI, daiIlkOracle421611);

ORACLE_INFO.set(1, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLE_INFO.set(4, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLE_INFO.set(5, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLE_INFO.set(42, CHAIN_ID_1_ASSET_ORACLE_INFO);
ORACLE_INFO.set(42161, CHAIN_ID_421611_ASSET_ORACLE_INFO);
ORACLE_INFO.set(421611, CHAIN_ID_421611_ASSET_ORACLE_INFO);
