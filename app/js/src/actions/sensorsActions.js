import * as types from '../constants/actionTypes';

export function updateSensor(key, value) {
  return {type: types.UPDATE_SENSOR, key, value};
}

export function saveSensor(id, location) {
  return (dispatch) => {
    if (!id) {
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

export function receiveLiveData(time, flow_ml) {
  return {type: types.RECEIVED_LIVE_DATA, time, flow_ml};
}

export function resetLiveData() {
  return {type: types.RESET_LIVE_DATA};
}

export function closeModal() {
  return {type: types.CLOSE_MODAL};
}

export function fetchDailyHistoricalData(location, start, end) {
  return (dispatch) => {
    dispatch({type: types.LOADING_HISTORICAL_DATA, status: true});
    return fetch('http://localhost:5000/data/daily?location=' + location + '&start=' + start + '&end=' + end, {
      method: 'GET'
    }).then(response => response.json())
      .then(json => dispatch({
          type: types.RECEIVED_HISTORICAL_DATA,
          data: JSON.parse(json).data
        })
      );
  };
}

export function fetchHourlyHistoricalData(location, start, end) {
  return dispatch => {
    dispatch({type: types.LOADING_HISTORICAL_DATA, status: true});
    return fetch('http://localhost:5000/data/hourly?location=' + location + '&start=' + start + '&end=' + end)
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

export function filterSensors(val) {
  const value = (val === null) ? "" : val;
  return {type: types.FILTER_SENSORS, value};
}

export function handleStartDate(date) {
  return {type: types.UPDATE_START_DATE, date};
}

export function handleEndDate(date) {
  return {type: types.UPDATE_END_DATE, date};
}
