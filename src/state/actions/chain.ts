import { IAsset } from '../../types/chain';
import { ActionType } from '../actionTypes/chain';

export const getAsset = (asset: any) => async (dispatch: any) => {
  const _asset = 'something';
  return dispatch(assetAdded(_asset));
};

function assetAdded(asset: any) {
  return {
    type: ActionType.ADD_ASSET,
    asset,
  };
}
