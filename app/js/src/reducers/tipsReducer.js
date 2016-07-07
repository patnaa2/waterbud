import { FLIP_TIP_CARD, RESET } from '../constants/actionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS([
  {
    location: 'Kitchen',
    text: 'Hello',
    isFlipped: false
  }, {
    location: 'Washroom',
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
