import { IAsset } from '../../types/chain';
import { ActionType } from '../actionTypes/chain';

export const getAssets = () => async (dispatch: any) => {
  // const assets = _getAssets()
  const assets = '';
  return dispatch(updateAssets(assets));
};

function updateAssets(assets: any) {
  return {
    type: ActionType.ASSETS_UPDATED,
    assets,
  };
}
