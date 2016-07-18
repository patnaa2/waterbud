import * as types from '../constants/actionTypes';

export function menuClick(status) {
  return {type: types.MENU_CLICK, status};
}

export function updateThreshold(threshold) {
  return {type: types.UPDATE_THRESHOLD, threshold};
}

export function saveSettings(threshold) {
  return (dispatch) => {
    fetch('http://localhost:5000/threshold?val=' + threshold, {
      method: 'POST'
    }).then(() => {
      dispatch({type: types.SAVE_SETTINGS});
    });
  };
}

export function retrieveNotifications() {
  return (dispatch) => {
    fetch('http://localhost:5000/notifications')
      .then(response => response.json())
      .then((json) => {
        dispatch({type: types.RETRIEVE_NOTIFICATIONS, notifications: JSON.parse(json)});
      });
  };
}

export function openNotifications() {
  return (dispatch) => {
    fetch('http://localhost:5000/notifications', {
      method: 'POST'
    }).then(() => {
      dispatch({type: types.OPEN_NOTIFICATIONS});
    });
  };
}

export function closeNotifications() {
  return {type: types.CLOSE_NOTIFICATIONS};
}
