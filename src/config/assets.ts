export const WETH = '0x303000000000';
export const DAI = '0x303100000000';
export const USDC = '0x303200000000';
export const WBTC = '0x303300000000';
export const stETH = '0x303400000000';
export const wstETH = '0x303500000000';
export const LINK = '0x303600000000';
export const ENS = '0x303700000000';
export const UNI = '0x313000000000';
export const yvUSDC = '0x303900000000';
export const MKR = '0x313100000000';
export const FRAX = '0x313800000000';
export const CVX3CRV = '0x313900000000';
export const USDT = '0x30a000000000';
export const CRAB = '0x333800000000';
export const RETH = '0xe03016000000';


// fCash assets
export const FDAI2203 = '0x313200000000';
export const FUSDC2203 = '0x313300000000';

export const FDAI2206 = '0x313400000000';
export const FUSDC2206 = '0x313500000000';

export const FDAI2209 = '0x313600000000';
export const FUSDC2209 = '0x313700000000';

export const FDAI2212 = '0x323300000000';
export const FUSDC2212 = '0x323400000000';
export const FETH2212 = '0x323800000000';

export const FDAI2303 = '0x323500000000';
export const FUSDC2303 = '0x323600000000';
export const FETH2303 = '0x323900000000';

export const FETH2306 = '0x40301200028b';
export const FDAI2306 = '0x40311200028b';
export const FUSDC2306 = '0x40321200028b';

export const FETH2309 = '0x40301200028e';
export const FDAI2309 = '0x40311200028e';
export const FUSDC2309 = '0x40321200028e';

export const FETH2312 = '0x403012000291';
export const FDAI2312 = '0x403112000291';
export const FUSDC2312 = '0x403212000291';

export enum TokenType {
  ERC20_ = 'ERC20_',
  ERC20_Permit = 'ERC20_Permit',
  ERC20_DaiPermit = 'ERC20_DaiPermit',
  ERC20_MKR = 'ERC20_MKR',
  ERC1155_ = 'ERC1155_',
  ERC720_ = 'ERC720_',
}

export interface IAssetInfo {
  tokenType: TokenType;
  tokenIdentifier?: number; // used for identifying tokens in a multitoken contract
  name: string;
  version: string;
  symbol: string;
  decimals: number;
  showToken: boolean;
  isWrappedToken: boolean; // Note: this is if it a token wrapped by the yield protocol (except ETH - which is handled differently)
  color: string;
  digitFormat: number; // this is the 'reasonable' number of digits to show. accuracy equivalent to +- 1 us cent.
  displaySymbol?: string; // override for symbol display
  wrapHandlerAddress?: string;
  wrappedTokenId?: string;
  wrappedTokenAddress?: string;
  unwrappedTokenId?: string;
  unwrappedTokenAddress?: string;
  limitToSeries?: string[];
}

export const ASSET_INFO = new Map<string, IAssetInfo>();

ASSET_INFO.set(DAI, {
  version: '1',
  name: 'Dai stable coin',
  decimals: 18,
  symbol: 'DAI',
  showToken: true,
  isWrappedToken: false,
  color: '#F5AC37',
  digitFormat: 2,
  tokenType: TokenType.ERC20_DaiPermit,
});

ASSET_INFO.set(USDC, {
  version: '1',
  name: 'USDC Stable coin',
  decimals: 18,
  symbol: 'USDC',
  showToken: true,
  isWrappedToken: false,
  color: '#2775CA',
  digitFormat: 2,
  tokenType: TokenType.ERC20_Permit,
});

ASSET_INFO.set(WBTC, {
  version: '1',
  name: 'Wrapped Bitcoin',
  decimals: 18,
  symbol: 'WBTC',
  showToken: true,
  isWrappedToken: false,
  color: '#5A5564',
  digitFormat: 6,
  tokenType: TokenType.ERC20_,
});

ASSET_INFO.set(ENS, {
  version: '1',
  name: 'Ethereum Naming Service',
  decimals: 18,
  symbol: 'ENS',
  showToken: true,
  isWrappedToken: false,
  color: '#000000',
  digitFormat: 2,
  tokenType: TokenType.ERC20_Permit,
});

ASSET_INFO.set(WETH, {
  version: '1',
  name: 'Wrapped Ether',
  decimals: 18,
  symbol: 'WETH',
  displaySymbol: 'ETH',
  showToken: true,
  isWrappedToken: false,
  color: '#FFFFFF',
  digitFormat: 6,
  tokenType: TokenType.ERC20_,
});

ASSET_INFO.set(wstETH, {
  version: '1',
  name: 'Wrapped Staked Ether',
  decimals: 18,
  symbol: 'wstETH',
  displaySymbol: 'wstETH',
  showToken: true,
  isWrappedToken: true,
  wrapHandlerAddress: '',
  wrappedTokenId: '',
  wrappedTokenAddress: '',
  color: '#00A3FF',
  digitFormat: 6,
  unwrappedTokenId: '0x303500000000',
  tokenType: TokenType.ERC20_Permit,
});

ASSET_INFO.set(stETH, {
  version: '1',
  name: 'Staked Eth',
  decimals: 18,
  symbol: 'stETH',
  showToken: true,
  isWrappedToken: false,
  wrapHandlerAddress: '0x491aB93faa921C8E634F891F96512Be14fD3DbB1',
  wrappedTokenId: '0x303400000000',
  wrappedTokenAddress: '0xB12C63eD91e901995E68023293AC1A308ffA6c3c',
  color: '#00A3FF',
  digitFormat: 6,
  unwrappedTokenId: '0x303500000000',
  tokenType: TokenType.ERC20_Permit,
});

ASSET_INFO.set(LINK, {
  version: '1',
  name: 'ChainLink',
  decimals: 18,
  symbol: 'LINK',
  showToken: true,
  isWrappedToken: false,
  color: '#2A5ADA',
  digitFormat: 6,
  tokenType: TokenType.ERC20_,
});

ASSET_INFO.set(yvUSDC, {
  version: '1',
  name: 'curve',
  decimals: 18,
  symbol: 'yvUSDC',
  showToken: true,
  isWrappedToken: false,
  color: '#3366CC',
  digitFormat: 2,
  tokenType: TokenType.ERC20_,
  limitToSeries: ['0x303230350000', '0x303230360000'],
});

ASSET_INFO.set(UNI, {
  version: '1',
  name: 'Uniswap token',
  decimals: 18,
  symbol: 'UNI',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC20_Permit,
});

ASSET_INFO.set(MKR, {
  version: '1',
  name: 'Maker Token',
  decimals: 18,
  symbol: 'MKR',
  showToken: false,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC20_MKR,
});

ASSET_INFO.set(FDAI2203, {
  version: '1',
  name: 'FDAI2203',
  decimals: 8,
  symbol: 'FDAI2203',
  showToken: false,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563373963149313,
  limitToSeries: ['0x303130360000'],
});

ASSET_INFO.set(FUSDC2203, {
  version: '1',
  name: 'FUSDC2203',
  decimals: 8,
  symbol: 'FUSDC2203',
  showToken: false,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844848939859969,
  limitToSeries: ['0x303230360000'],
});

ASSET_INFO.set(FDAI2206, {
  version: '1',
  name: 'FDAI2206',
  decimals: 8,
  symbol: 'FDAI2206',
  showToken: false,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563373963149313,
  limitToSeries: ['0x303130360000'],
});

ASSET_INFO.set(FUSDC2206, {
  version: '1',
  name: 'FUSDC2206',
  decimals: 8,
  symbol: 'FUSDC2206',
  showToken: false,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844848939859969,
  limitToSeries: ['0x303230360000'],
});

ASSET_INFO.set(FDAI2206, {
  version: '1',
  name: 'fDAI2206',
  decimals: 8,
  symbol: 'FDAI2206',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563373963149313,
  limitToSeries: ['0x303130360000'],
});

ASSET_INFO.set(FUSDC2206, {
  version: '1',
  name: 'fUSDC2206',
  decimals: 8,
  symbol: 'FUSDC2206',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844848939859969,
  limitToSeries: ['0x303230360000'],
});

ASSET_INFO.set(FDAI2209, {
  version: '1',
  name: 'fDAI2209',
  decimals: 8,
  symbol: 'FDAI2209',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563375953805313,
  limitToSeries: ['0x303130370000'],
});

ASSET_INFO.set(FUSDC2209, {
  version: '1',
  name: 'fUSDC2209',
  decimals: 8,
  symbol: 'FUSDC2209',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844850930515969,
  limitToSeries: ['0x303230370000'],
});

ASSET_INFO.set(FRAX, {
  version: '1',
  name: 'frax',
  decimals: 18,
  symbol: 'FRAX',
  showToken: true,
  isWrappedToken: false,
  color: '#ffffff',
  digitFormat: 6,
  tokenType: TokenType.ERC20_,
  limitToSeries: [],
});

ASSET_INFO.set(CVX3CRV, {
  version: '1',
  name: 'cvx3crv',
  decimals: 18,
  symbol: 'cvx3crv',
  showToken: true,
  color: '#ffffff',
  isWrappedToken: false,
  digitFormat: 6,
  tokenType: TokenType.ERC20_,
  limitToSeries: [
    '0x303130360000', // june dai
    '0x303130370000', // sept dai
    '0x303230370000', // sept usdc
    '0x303230360000', // june usdc
  ],
});

ASSET_INFO.set(FDAI2212, {
  version: '1',
  name: 'fDAI2212',
  decimals: 8,
  symbol: 'FDAI2212',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563377944461313,
  limitToSeries: ['0x303130380000'],
});

ASSET_INFO.set(FDAI2303, {
  version: '1',
  name: 'fDAI2303',
  decimals: 8,
  symbol: 'FDAI2303',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563379935117313,
  limitToSeries: ['0x303130390000'],
});

ASSET_INFO.set(FUSDC2212, {
  version: '1',
  name: 'fUSDC2212',
  decimals: 8,
  symbol: 'FUSDC2212',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844852921171969,
  limitToSeries: ['0x303230380000'],
});

ASSET_INFO.set(FUSDC2303, {
  version: '1',
  name: 'fUSDC2303',
  decimals: 8,
  symbol: 'FUSDC2303',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844854911827969,
  limitToSeries: ['0x303230390000'],
});

ASSET_INFO.set(FETH2212, {
  version: '1',
  name: 'fETH2212',
  decimals: 8,
  symbol: 'FETH2212',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 281902967750657,
  limitToSeries: ['0x303030380000'],
});

ASSET_INFO.set(FETH2303, {
  version: '1',
  name: 'fETH2303',
  decimals: 8,
  symbol: 'FETH2303',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 281904958406657,
  limitToSeries: ['0x303030390000'],
});

ASSET_INFO.set(USDT, {
  version: '1',
  name: 'Tether USD',
  decimals: 6,
  symbol: 'USDT',
  showToken: true,
  isWrappedToken: false,
  color: '#26A17B',
  digitFormat: 2,
  tokenType: TokenType.ERC20_,
});

ASSET_INFO.set(FETH2306, {
  version: '1',
  name: 'fETH2306',
  decimals: 8,
  symbol: 'FETH2306',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 281906949062657,
  limitToSeries: ['0x0030ff00028c'],
})

ASSET_INFO.set(FDAI2306, {
  version: '1',
  name: 'fDAI2306',
  decimals: 8,
  symbol: 'FDAI2306',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 2,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563381925773313,
  limitToSeries: ['0x0031ff00028c'],
})

ASSET_INFO.set(FUSDC2306, {
  version: '1',
  name: 'fUSDC2306',
  decimals: 8,
  symbol: 'FUSDC2306',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 2,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844856902483969,
  limitToSeries: ['0x0032ff00028c'],
})

ASSET_INFO.set(FETH2309, {
  version: '1',
  name: 'fETH2309',
  decimals: 8,
  symbol: 'FETH2309',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 281908939718657,
})

ASSET_INFO.set(FDAI2309, {
  version: '1',
  name: 'fDAI2309',
  decimals: 8,
  symbol: 'FDAI2309',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 2,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563383916429313,
})

ASSET_INFO.set(FUSDC2309, {
  version: '1',
  name: 'fUSDC2309',
  decimals: 8,
  symbol: 'FUSDC2309',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 2,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844858893139969,
})

ASSET_INFO.set(FETH2312, {
  version: '1',
  name: 'fETH2312',
  decimals: 8,
  symbol: 'FETH2312',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 6,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 281910930374657,
})

ASSET_INFO.set(FDAI2312, {
  version: '1',
  name: 'fDAI2312',
  decimals: 8,
  symbol: 'FDAI2312',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 2,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 563385907085313,
})

ASSET_INFO.set(FUSDC2312, {
  version: '1',
  name: 'fUSDC2312',
  decimals: 8,
  symbol: 'FUSDC2312',
  showToken: true,
  isWrappedToken: false,
  color: '#FF007A',
  digitFormat: 2,
  tokenType: TokenType.ERC1155_,
  tokenIdentifier: 844860883795969,
})

ASSET_INFO.set(CRAB, {
  version: '1',
  name: 'Crab Strategy v2',
  decimals: 18,
  symbol: 'Crabv2',
  showToken: true,
  digitFormat: 2,
  tokenType: TokenType.ERC20_,
  isWrappedToken: false, 
  color: '#FF007A',
})

ASSET_INFO.set(RETH, {
        version: '1',
        name: 'Rocket Pool ETH',
        decimals: 18,
        symbol: 'rETH',
        showToken: true,
        digitFormat: 6,
        tokenType: TokenType.ERC20_,
        isWrappedToken: false,
        color: '#FF007A',
})
