import {
  ADD_SENSOR,
  // INITIALIZE_ADD_SENSOR,
  FLIP_SENSOR_CARD,
  LOAD_SENSOR,
  REMOVE_SENSOR,
  RESET,
  VIEW_MODE,
  UPDATE_SENSOR,
  SAVE_SENSOR
} from '../constants/actionTypes';
import {CARD} from '../constants/viewConstants';
import Immutable from 'immutable';

const newSensor = Immutable.fromJS({
  id: 3,
  name: '',
  location: 'Kitchen',
  isFlipped: false
});

const initialState = Immutable.fromJS({
  sensors: [
    {
      location: 'Kitchen',
      name: 'Sink',
      id: 1,
      isFlipped: false
    }, {
      location: 'Washroom',
      name: 'Shower',
      id: 2,
      isFlipped: false
    }
  ],
  editSensor: newSensor,
  isAddingSensor: false,
  timeStamp: null,
  viewMode: CARD
});

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    // case INITIALIZE_ADD_SENSOR:
    //   return state.update('isAddingSensor', action.status);

    // case ADD_SENSOR:
    //   return state.set('isAddingSensor', false)
    //               .set('timeStamp', null)
    //               .update('sensors', (list) => list.push(Immutable.fromJS(action.data)));

    case ADD_SENSOR:
      return state.update('sensors', (list) => list.push(state.get('editSensor')));

    case SAVE_SENSOR:
      return state.setIn(['sensors', state.getIn(['editSensor', 'id']) - 1], state.get('editSensor'));

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

    case RESET:
      return initialState;

    default:
      return state;
  }
}
