import { combineReducers } from 'redux';
import misc from './miscReducer';
import tips from './tipsReducer';

export default combineReducers({
  misc,
  tips
});
