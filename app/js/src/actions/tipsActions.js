import * as types from '../constants/actionTypes';

export function flipTipCard(index, status) {
  return {type: types.FLIP_TIP_CARD, index, status};
}
