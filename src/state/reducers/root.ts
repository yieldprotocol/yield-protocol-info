import { combineReducers } from 'redux';
import chain from './chain';
import contracts from './contracts';
import vaults from './vaults';
import application from './application';

export default combineReducers({
  application,
  chain,
  contracts,
  vaults,
});
