import {
  ADD_SENSOR,
  INITIALIZE_ADD_SENSOR,
  FLIP_SENSOR_CARD,
  REMOVE_SENSOR,
  RESET,
  VIEW_MODE,
  UPDATE_SENSOR
} from '../constants/actionTypes';
import {CARD} from '../constants/viewConstants';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  sensors: [
    {
      location: 'Laundry Room',
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
  isAddingSensor: false,
  timeStamp: null,
  viewMode: CARD
});

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_ADD_SENSOR:
      return state.update('isAddingSensor', action.status);

    case ADD_SENSOR:
      return state.set('isAddingSensor', false)
                  .set('timeStamp', null)
                  .update('sensors', (list) => list.push(Immutable.fromJS(action.data)));

    case UPDATE_SENSOR:
      return state.update('sensors', (list) => list.push(Immutable.fromJS(action.data)));

    case REMOVE_SENSOR:
      return state.update('sensors', (list) => list.delete(list.findIndex((item) => item.id === action.id)));

    case VIEW_MODE:
      return state.set('viewMode', action.viewMode);

    case FLIP_SENSOR_CARD:
      return state.setIn(['sensors', action.index, 'isFlipped'], action.status);

    case RESET:
      return initialState;

    default:
      return state;
  }
}
