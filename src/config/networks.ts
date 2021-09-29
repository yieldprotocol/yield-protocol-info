export enum ChainId {
  MAINNET = 1 as number,
  KOVAN = 42 as number,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.KOVAN]: 'Kovan',
};
