import { combineReducers } from 'redux';
import misc from './miscReducer';
import sensors from './sensorsReducer';
import tips from './tipsReducer';

export default combineReducers({
  misc,
  sensors,
  tips
});
