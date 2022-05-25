export const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.REACT_APP_RPC_URL_1,
  4: process.env.REACT_APP_RPC_URL_4,
  5: process.env.REACT_APP_RPC_URL_5,
  42: process.env.REACT_APP_RPC_URL_42,
  10: process.env.REACT_APP_RPC_URL_10,
  69: process.env.REACT_APP_RPC_URL_69,
  42161: process.env.REACT_APP_RPC_URL_42161,
  421611: process.env.REACT_APP_RPC_URL_421611,
};

export const SUPPORTED_RPC_URLS: { [chainId: number]: string } = {
  1: RPC_URLS[1],
  42161: RPC_URLS[42161],
};

export const SUPPORTED_CHAIN_IDS: number[] = Object.keys(SUPPORTED_RPC_URLS).map((chainId: string) => +chainId);

export const CHAIN_INFO = new Map<
  number,
  { name: string; color: string; bridge?: string; explorer?: string; etherscanApi?: string; subgraphNetwork?: string }
>();

CHAIN_INFO.set(1, {
  name: 'Ethereum',
  color: '#29b6af',
  explorer: 'https://etherscan.io',
  etherscanApi: 'https://api.etherscan.io/api',
  subgraphNetwork: 'v2-mainnet',
});

CHAIN_INFO.set(42161, {
  name: 'Arbitrum',
  color: '#1F2937',
  bridge: 'https://bridge.arbitrum.io',
  explorer: 'https://arbiscan.io',
  etherscanApi: 'https://api.arbiscan.io/api',
  subgraphNetwork: 'v2-arbitrum',
});
