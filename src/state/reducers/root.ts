import { combineReducers } from 'redux';
import chain from './chain';
import contracts from './contracts';

export default combineReducers({
  chain,
  contracts,
});
