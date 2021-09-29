export enum ChainId {
  MAINNET = 1,
  KOVAN = 42,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.KOVAN]: 'Kovan',
};
