import { MENU_CLICK } from '../constants/actionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  isOpen: false
});

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    case MENU_CLICK:
      return state.set('isOpen', action.status);

    default:
      return state;
  }
}
