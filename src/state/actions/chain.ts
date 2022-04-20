import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { cleanValue } from '../../utils/appUtils';
import { decimalNToDecimal18 } from '../../utils/yieldMath';
import { ActionType } from '../actionTypes/chain';
import { getPrice, updatePrices, reset as resetVaults } from './vaults';
import { reset as resetContracts } from './contracts';
import * as contracts from '../../contracts';
import {
  IAsset,
  IAssetMap,
  IAssetPairData,
  IChainAssetPairDataLoadingAction,
  IChainAssetsLoadingAction,
  IChainChainIdAction,
  IChainChainLoadingAction,
  IChainProviderAction,
  IChainResetAction,
  IChainSeriesLoadingAction,
  IChainStrategiesLoadingAction,
  IChainTvlLoadingAction,
  IChainUpdateAssetPairMapAction,
  IChainUpdateAssetsAction,
  IChainUpdateAssetsTVLAction,
  IChainUpdateSeriesAction,
  IChainUpdateStrategiesAction,
  ISeriesMap,
  IStrategyMap,
} from '../../types/chain';
import { IContractMap } from '../../types/contracts';
import { CAULDRON, LADLE } from '../../utils/constants';
import { IPriceMap } from '../../types/vaults';
import { ASSET_INFO, FDAI2203, FDAI2206, FDAI2209, TokenType } from '../../config/assets';

export const reset = (): IChainResetAction => ({ type: ActionType.RESET });

const updateAssetsTvl = (assetsTvl: any): IChainUpdateAssetsTVLAction => ({
  type: ActionType.UPDATE_ASSETS_TVL,
  payload: assetsTvl,
});
const tvlLoading = (loading: boolean): IChainTvlLoadingAction => ({ type: ActionType.TVL_LOADING, payload: loading });
const assetPairDataLoading = (loading: boolean): IChainAssetPairDataLoadingAction => ({
  type: ActionType.ASSET_PAIR_DATA_LOADING,
  payload: loading,
});

export const updateProvider = (provider: ethers.providers.JsonRpcProvider): IChainProviderAction => ({
  type: ActionType.PROVIDER,
  payload: provider,
});

export const updateChain =
  (chainId: number): any =>
  async (dispatch: any) => {
    dispatch(reset());
    dispatch(resetVaults());
    dispatch(resetContracts());
    dispatch(updateChainId(chainId));
  };

export const getSeriesForState = async (contractMap: IContractMap) => async (dispatch: any) => {
  dispatch(setSeriesLoading(true));

  const Ladle = contractMap[LADLE];
  const Cauldron = contractMap[CAULDRON];

  try {
    /* get poolAdded events and series events at the same time */
    const [seriesAddedEvents, poolAddedEvents] = await Promise.all([
      Cauldron.queryFilter('SeriesAdded' as EventFilter),
      Ladle.queryFilter('PoolAdded' as EventFilter),
    ]);

    /* build a map from the poolAdded event data */
    const poolMap: Map<string, string> = new Map(
      poolAddedEvents.map((log: any) => Ladle.interface.parseLog(log).args) as [[string, string]]
    );

    const newSeriesObj: any = {};

    /* Add in any extra static series */
    await Promise.all([
      ...seriesAddedEvents.map(async (x: any): Promise<void> => {
        const { seriesId: id, baseId, fyToken } = Cauldron.interface.parseLog(x).args;
        const { maturity } = await Cauldron.series(id);

        if (poolMap.has(id)) {
          // only add series if it has a pool
          const poolAddress: string = poolMap.get(id) as string;
          const poolContract = contracts.Pool__factory.connect(poolAddress, provider);
          const fyTokenContract = contracts.FYToken__factory.connect(fyToken, provider);

          const [name, symbol, version, decimals, poolName, poolVersion, poolSymbol, totalSupply] = await Promise.all([
            fyTokenContract.name(),
            fyTokenContract.symbol(),
            fyTokenContract.version(),
            fyTokenContract.decimals(),
            poolContract.name(),
            poolContract.version(),
            poolContract.symbol(),
            poolContract.totalSupply(),
          ]);
          const newSeries = {
            id,
            baseId,
            maturity,
            name,
            symbol,
            version,
            address: fyToken,
            fyTokenAddress: fyToken,
            decimals,
            poolAddress,
            poolVersion,
            poolName,
            poolSymbol,
            totalSupply,
          };
          newSeriesObj[id] = _chargeSeries(newSeries);
        }
      }),
    ]);
    dispatch(updateSeries(newSeriesObj));
    dispatch(setSeriesLoading(false));
  } catch (e) {
    dispatch(setSeriesLoading(false));
    console.log('Error fetching series data: ', e);
  }
};

export const updateChainId = (chainId: number): IChainChainIdAction => ({
  type: ActionType.CHAIN_ID,
  payload: chainId,
});
export const setChainLoading = (chainLoading: boolean): IChainChainLoadingAction => ({
  type: ActionType.CHAIN_LOADING,
  payload: chainLoading,
});
export const setSeriesLoading = (seriesLoading: boolean): IChainSeriesLoadingAction => ({
  type: ActionType.SERIES_LOADING,
  payload: seriesLoading,
});
export const setStrategiesLoading = (strategiesLoading: boolean): IChainStrategiesLoadingAction => ({
  type: ActionType.STRATEGIES_LOADING,
  payload: strategiesLoading,
});
export const setAssetsLoading = (assetsLoading: boolean): IChainAssetsLoadingAction => ({
  type: ActionType.ASSETS_LOADING,
  payload: assetsLoading,
});
export const updateSeries = (series: ISeriesMap): IChainUpdateSeriesAction => ({
  type: ActionType.UPDATE_SERIES,
  payload: series,
});
export const updateStrategies = (strategies: IStrategyMap): IChainUpdateStrategiesAction => ({
  type: ActionType.UPDATE_STRATEGIES,
  payload: strategies,
});
export const updateAssets = (assets: IAssetMap): IChainUpdateAssetsAction => ({
  type: ActionType.UPDATE_ASSETS,
  payload: assets,
});
export const updateAssetPairData = (
  assetId: string,
  assetPairData: IAssetPairData[]
): IChainUpdateAssetPairMapAction => ({
  type: ActionType.UPDATE_ASSET_PAIR_DATA,
  payload: { assetId, assetPairData },
});
