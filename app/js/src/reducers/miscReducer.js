import { MENU_CLICK, SAVE_SETTINGS, UPDATE_THRESHOLD } from '../constants/actionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  isOpen: false,
  threshold: 0
});

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    case MENU_CLICK:
      return state.set('isOpen', action.status);

    case UPDATE_THRESHOLD:
      return state.set('threshold', action.threshold);

    case SAVE_SETTINGS:
      return state;

    default:
      return state;
  }
}
