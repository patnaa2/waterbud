import {
  CLOSE_TIPS_MODAL,
  FLIP_TIP_CARD,
  LOADING_TIPS,
  NEXT_TIP,
  OPEN_TIPS_MODAL,
  PREV_TIP,
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
  kitchen_sink: {
    msg: [{
      short: 'Hello',
      read: 1,
      image: '',
      msg: 'My name is what?',
      location: 'kitchen',
      date: '07/16 14:16:12'
    }, {
      short: 'What up',
      read: 1,
      image: '',
      msg: 'How are you?',
      location: 'kitchen',
      date: '07/16 14:16:12'
   }]
  },
  bathroom_sink: {
    msg: [{
      short: 'Hello',
      read: 1,
      image: '',
      msg: 'My name is what?',
      location: 'bathroom_sink',
      date: '07/16 14:16:12'
    }, {
      short: 'What up',
      read: 1,
      image: '',
      msg: 'How are you?',
      location: 'bathroom_sink',
      date: '07/16 14:16:12'
   }]
  },
  garden: {
    msg: [{
      short: 'Hello',
      read: 1,
      image: '',
      msg: 'My name is what?',
      location: 'garden',
      date: '07/16 14:16:12'
    }, {
      short: 'What up',
      read: 1,
      image: '',
      msg: 'How are you?',
      location: 'garden',
      date: '07/16 14:16:12'
   }]
  },
  recent: [],
  loading: false,
  isOpen: false,
  tipLocationToShow: 'kitchen_sink',
  tipNumber: 0
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
      return state.set('isOpen', true).set('tipLocationToShow', action.tipsToShow);

    case CLOSE_TIPS_MODAL:
      return state.updateIn([state.get('tipLocationToShow').toLowerCase(), 'msg'], (element) => element.map(item => item.set('read', 1)))
                  .set('isOpen', false).set('tipNumber', 0);

    case PREV_TIP:
      return state.update('tipNumber', (tip) => tip - 1);

    case NEXT_TIP:
      return state.update('tipNumber', (tip) => tip + 1);

    default:
      return state;
  }
}
