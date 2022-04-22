export interface IVaultState {
  vaultsLoading: boolean;
  vaults: IVaultMap | null;
  prices: IPriceMap;
  vaultsGot: boolean;
}

export interface IVaultMap {
  [id: string]: IVault;
}

export interface IVault {
  id: string;
  seriesId: string;
  baseId: string;
  ilkId: string;
  owner: string;
  isWitchOwner: string;
  collatRatioPct: string;
  minCollatRatioPct: string;
  ink: string;
  art: string;
  decimals: string;
}

export interface IPriceMap {
  [id: string]: IPrice;
}

export interface IPrice {
  [id: string]: string;
}

export interface IVaultRoot {
  id: string;
  seriesId: string;
  baseId: string;
  ilkId: string;
  decimals: string;
  owner: string;
}

export interface IVaultGraph {
  collateral: { asset: IAssetGraph };
  collateralAmount: string;
  debtAmount: string;
  id: string;
  owner: string;
  series: ISeriesGraph;
}

interface IAssetGraph {
  name: string;
  symbol?: string;
  assetId: string;
  decimals: number;
}

interface ISeriesGraph {
  baseAsset: IAssetGraph;
  fyToken: { maturity: number };
  id: string;
}
