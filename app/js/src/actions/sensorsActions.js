import * as types from '../constants/actionTypes';

export function retrieveSensors() {
  return (dispatch) => {
    dispatch({type: types.LOADING_SENSORS, status: true});
    return fetch('http://localhost:5000/add_sensor', {
      method: 'GET'
    }).then(response => response.json())
      .then(json => dispatch({
          type: types.RECEIVED_SENSORS,
          data: JSON.parse(json)
        })
      );
  };
}

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

export function removeSensor(id, last) {
  return (dispatch) => {
    console.log('id', id, last);
    if (id === last) {
      fetch('http://localhost:5000/add_sensor', {
        method: 'DELETE'
      }).then(() => {
        dispatch({type: types.REMOVE_SENSOR, id});
      });
    } else {
      dispatch({type: types.REMOVE_SENSOR, id});
    }
  };
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

export function receiveLiveData(timestamp, flow_ml) {
  return {type: types.RECEIVED_LIVE_DATA, timestamp, flow_ml};
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
          data: JSON.parse(json)
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
          data: JSON.parse(json)
        })
      );
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

export function updateHistoricalLocation(location) {
  return {type: types.UPDATE_HISTORICAL_LOCAITON, location};
}

export function updateHistoricalResolution(resolution) {
  return {type: types.UPDATE_HISTORICAL_RESOLUTION, resolution};
}
export function resetHistoricalDates() {
  return {type: types.RESET_HISTORICAL_DATES};
}
