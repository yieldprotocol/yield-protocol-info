import { ActionType } from '../actionTypes/application';
import { IAppChainIdAction, IAppThemeAction } from '../../types/application';

export const updateTheme = (theme: string): IAppThemeAction => ({
  type: ActionType.THEME,
  payload: theme,
});

export const updateChainId = (chainId: number): IAppChainIdAction => ({ type: ActionType.CHAIN_ID, payload: chainId });
