import {
  CLOSE_TIPS_MODAL,
  FLIP_TIP_CARD,
  LOADING_TIPS,
  OPEN_TIPS_MODAL,
  RECEIVED_TIPS,
  RESET
} from '../constants/actionTypes';
import Immutable from 'immutable';
import * as SensorLocation from '../constants/sensorLocations';

const initialState = Immutable.fromJS({
  cards: [{
      title: 'Recent',
      isFlipped: false
    }, {
      title: SensorLocation.KITCHEN_SINK,
      isFlipped: false
    }, {
      title: SensorLocation.GARDEN,
      isFlipped: false
    }, {
      title: SensorLocation.BATHROOM_SINK,
      isFlipped: false
  }],
  kitchen_sink: [{
      short: 'Hello',
      msg: 'My name is what?'
    }, {
      short: 'What up',
      msg: 'How are you?'
  }],
  bathroom_sink: [{
      short: 'Hello',
      msg: 'My name is what?'
    }, {
      short: 'What up',
      msg: 'How are you?'
  }],
  garden: [{
      short: 'Hello',
      msg: 'My name is what?'
    }, {
      short: 'What up',
      msg: 'How are you?'
  }],
  loading: false,
  isOpen: false,
  tipsToShow: ''
});

export default function tipReducer(state = initialState, action) {
  switch (action.type) {
    case FLIP_TIP_CARD:
      return state.setIn(['cards', action.index, 'isFlipped'], action.status);

    case RESET:
      return state.map((obj) => obj.set('isFlipped', false));

    case LOADING_TIPS:
      return state.set('loading', true);

    case RECEIVED_TIPS:
      return state.set('loading', false).set('recent', Immutable.fromJS(action.data));

    case OPEN_TIPS_MODAL:
      return state.set('isOpen', true).set('tipsToShow', action.tipsToShow);

    case CLOSE_TIPS_MODAL:
      return state.set('isOpen', false);
    default:
      return state;
  }
}
