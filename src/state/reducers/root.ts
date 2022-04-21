import { combineReducers } from 'redux';
import chain from './chain';
import contracts from './contracts';
import vaults from './vaults';

export default combineReducers({
  chain,
  contracts,
  vaults,
});
