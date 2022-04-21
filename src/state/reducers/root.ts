import { combineReducers } from 'redux';
import contracts from './contracts';
import vaults from './vaults';

export default combineReducers({
  contracts,
  vaults,
});
