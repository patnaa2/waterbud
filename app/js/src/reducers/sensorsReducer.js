import {
  FLIP_SENSOR_CARD,
  LOAD_SENSOR,
  REMOVE_SENSOR,
  RESET_HISTORICAL_DATA,
  VIEW_MODE,
  UPDATE_SENSOR,
  RECEIVED_LIVE_DATA,
  LOADING_HISTORICAL_DATA,
  RECEIVED_HISTORICAL_DATA,
  RESET_LIVE_DATA,
  SAVE_SENSOR
} from '../constants/actionTypes';
import {CARD} from '../constants/viewConstants';
import Immutable from 'immutable';

import * as SensorLocation from '../constants/sensorLocations';


const newSensor = Immutable.fromJS({
  id: 0,
  name: '',
  location: SensorLocation.BATHROOM_SINK,
  isFlipped: false
});

const initialState = Immutable.fromJS({
  sensors: [
    {
      location: SensorLocation.KITCHEN_SINK,
      name: 'Kitchen Sink',
      id: 1,
      isFlipped: false
    }, {
      location: SensorLocation.BATHROOM_SINK,
      name: 'Master Bedroom Sink',
      id: 2,
      isFlipped: false
    }
  ],
  editSensor: newSensor,
  isAddingSensor: false,
  historicalData: [],
  liveData: {
    time: [],
    flow_ml: [],
    zeros: [],
    total_flow_ml: 0
  },
  timeStamp: null,
  viewMode: CARD,
  loading: false
});

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_SENSOR: {
      const id = (state.getIn(['editSensor', 'id']) === 0) ? state.get('sensors').size : state.getIn(['editSensor', 'id']) - 1;
      return state.setIn(['sensors', id], state.get('editSensor'));
    }
    case REMOVE_SENSOR:
      return state.update('sensors', (list) => list.delete(list.findIndex((item) => item.id === action.id)));

    case VIEW_MODE:
      return state.set('viewMode', action.viewMode);

    case FLIP_SENSOR_CARD:
      return state.setIn(['sensors', action.index, 'isFlipped'], action.status);

    case LOAD_SENSOR:
      if (action.index === 0) {
        return state.set('editSensor', newSensor);
      }
      return state.set('editSensor', state.getIn(['sensors', action.index -1]));

    case UPDATE_SENSOR:
      return state.setIn(['editSensor', action.key], action.value);

    case RECEIVED_LIVE_DATA:
      if (state.getIn(['liveData', 'time']).size < 60) {
        return state.updateIn(['liveData', 'time'], (data) => data.push(action.time.toString()))
                    .updateIn(['liveData', 'flow_ml'], (data) => data.push(action.flow_ml.toString()))
                    .updateIn(['liveData', 'zeros'], (data) => data.push('0'))
                    .updateIn(['liveData', 'total_flow_ml'], (value) => value + action.flow_ml);
      }
      return state.updateIn(['liveData', 'time'], (data) => data.shift().push(action.time.toString()))
                  .updateIn(['liveData', 'flow_ml'], (data) => data.shift().push(action.flow_ml.toString()))
                  .updateIn(['liveData', 'zeros'], (data) => data.push('0'))
                  .updateIn(['liveData', 'total_flow_ml'], (value) => value + action.flow_ml);

    case LOADING_HISTORICAL_DATA:
      return state.set('loading', action.status);

    case RECEIVED_HISTORICAL_DATA:
      return state.set('loading', false).set('historicalData', Immutable.fromJS(action.data));

    case RESET_LIVE_DATA:
      return state.set('liveData', Immutable.fromJS({
        time: [],
        flow_ml: [],
        zeros: [],
        total_flow_ml: 0
      }));

    case RESET_HISTORICAL_DATA:
      return state.set('historicalData', Immutable.fromJS([]));

    default:
      return state;
  }
}
