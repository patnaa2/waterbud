import * as types from '../constants/actionTypes';

// export function addSensor(status) {
//   return {type: types.INITIALIZE_ADD_SENSOR, status};
// }

// export function checkAddSensor() {
//   return {type: types.ADD_SENSOR, status};
// }

export function updateSensor(key, value) {
  return {type: types.UPDATE_SENSOR, key, value};
}

export function saveSensor(id, location) {
  return (dispatch) => {
    if (id >= 3) {
      fetch('http://localhost:5000/add_sensor?location=' + location, {
        method: 'POST'
      }).then(() => {
        dispatch({type: types.SAVE_SENSOR});
      });
    } else {
      dispatch({type: types.SAVE_SENSOR});
    }
  };
}

export function removeSensor(id) {
  return {type: types.REMOVE_SENSOR, id};
}

export function viewMode(viewMode) {
  return {type: types.VIEW_MODE, viewMode};
}

export function flipSensorCard(index, status) {
  return {type: types.FLIP_SENSOR_CARD, index, status};
}

export function loadSensor(index) {
  return {type: types.LOAD_SENSOR, index};
}

export function receiveLiveData(data) {
  return {type: types.RECEIVED_LIVE_DATA, data};
}

export function resetLiveData() {
  return {type: types.RESET_LIVE_DATA};
}

export function fetchHistoricalData() {
  return dispatch => {
    dispatch({type: types.LOADING_HISTORICAL_DATA, status: true});
    return fetch('HISTORICAL_DATA_ENDPOINT')
      .then(response => response.json())
      .then(json =>
        dispatch({
          type: types.RECEIVED_HISTORICAL_DATA,
          data: json //FORMAT OF JSON OBJECT
        })
      ).catch(err => {
        dispatch({type: types.LOADING_HISTORICAL_DATA, status: false});
        throw new Error('Error retrieving Historical data', err);
      });
  };
}
