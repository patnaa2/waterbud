import { FLIP_TIP_CARD, RESET } from '../constants/actionTypes';
import Immutable from 'immutable';
import * as SensorLocation from '../constants/sensorLocations';

const initialState = Immutable.fromJS([
  {
    location: SensorLocation.KITCHEN_SINK,
    text: 'Hello',
    isFlipped: false
  }, {
    location: SensorLocation.BATHROOM_SINK,
    text: 'Sup?',
    isFlipped: false
  }
]);

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    case FLIP_TIP_CARD:
      return state.setIn([action.index, 'isFlipped'], action.status);

    case RESET:
      return state.map((obj) => obj.set('isFlipped', false));

    default:
      return state;
  }
}
