import { IAsset } from '../../types/chain';
import { ActionType } from '../actionTypes/chain';

export const getAssets = () => async (dispatch: any) => {
  const assets = _getAssets()
  return dispatch(updateAssets(assets));
};

  const _getAssets = async () => {
    /* get all the assetAdded, roacleAdded and joinAdded events and series events at the same time */
    const [assetAddedEvents, joinAddedEvents] = await Promise.all([
      Cauldron.queryFilter('AssetAdded' as any, lastAssetUpdate),
      Ladle.queryFilter('JoinAdded' as any, lastAssetUpdate),
    ]);
    /* Create a map from the joinAdded event data */
    const joinMap: Map<string, string> = new Map(
      joinAddedEvents.map((log: any) => Ladle.interface.parseLog(log).args) as [[string, string]]
    );

    const newAssetList: any[] = [];
    await Promise.all(
      assetAddedEvents.map(async (x: any) => {
        const { assetId: id, asset: address } = Cauldron.interface.parseLog(x).args;
        const ERC20 = contracts.ERC20Permit__factory.connect(address, fallbackLibrary);
        /* Add in any extra static asset Data */ // TODO is there any other fixed asset data needed?
        const [name, symbol, decimals] = await Promise.all([
          ERC20.name(),
          ERC20.symbol(),
          ERC20.decimals(),
          // ETH_BASED_ASSETS.includes(id) ? async () =>'1' : ERC20.version()
        ]);

        // console.log(symbol, ':', id);
        // TODO check if any other tokens have different versions. maybe abstract this logic somewhere?
        const version = id === '0x555344430000' ? '2' : '1';

        const newAsset = {
          id,
          address,
          name,
          symbol: symbol !== 'WETH' ? symbol : 'ETH',
          decimals,
          version,
          joinAddress: joinMap.get(id),
        };
        // Update state and cache
        updateState({ type: 'addAsset', payload: _chargeAsset(newAsset) });
        newAssetList.push(newAsset);
      })
    );
function updateAssets(assets: any) {
  return {
    type: ActionType.ASSETS_UPDATED,
    assets,
  };
}
