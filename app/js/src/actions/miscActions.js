import * as types from '../constants/actionTypes';

export function menuClick(status) {
  return {type: types.MENU_CLICK, status};
}
