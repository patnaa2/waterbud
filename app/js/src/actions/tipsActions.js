import * as types from '../constants/actionTypes';

export function flipTipCard(index, status) {
  return {type: types.FLIP_TIP_CARD, index, status};
}

export function retrieveTips() {
  return (dispatch) => {
    dispatch({type: types.LOADING_TIPS, status: true});
    return fetch('http://localhost:5000/tips', {
      method: 'GET'
    }).then(response => response.json())
      .then(json => dispatch({
          type: types.RECEIVED_TIPS,
          data: JSON.parse(json)
        })
      );
  };
}

export function openTipsModal(tipsToShow) {
  return {type: types.OPEN_TIPS_MODAL, tipsToShow};
}

export function closeTipsModal() {
  return {type: types.CLOSE_TIPS_MODAL};
}

export function nextTip() {
  return {type: types.NEXT_TIP};
}

export function prevTip() {
  return {type: types.PREV_TIP};
}
