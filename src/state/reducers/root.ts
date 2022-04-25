import { combineReducers } from 'redux';
import contracts from './contracts';
import application from './application';

export default combineReducers({
  contracts,
  application,
});
