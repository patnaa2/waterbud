import * as types from '../constants/actionTypes';

export function addSensor(status) {
  return {type: types.INITIALIZE_ADD_SENSOR, status};
}

export function checkAddSensor() {
  return {type: types.ADD_SENSOR, status};
}

export function updateSensor(key, value) {
  return {type: types.UPDATE_SENSOR, key, value};
}

export function saveSensor() {
  return {type: types.SAVE_SENSOR};
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
