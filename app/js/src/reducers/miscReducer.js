import {
  CLOSE_NOTIFICATIONS,
  MENU_CLICK,
  OPEN_NOTIFICATIONS,
  RETRIEVE_NOTIFICATIONS,
  RETRIEVE_SOCKET_LOCATION,
  SAVE_SETTINGS,
  UPDATE_THRESHOLD
} from '../constants/actionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  isOpen: false,
  notifications: {
    notifications: 0,
    new_msgs: [],
    recent_msgs: []
  },
  notificationsOpen: false,
  socketLocation: '127.0.0.1:8888',
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

    case RETRIEVE_NOTIFICATIONS:
      return state.set('notifications', Immutable.fromJS(action.notifications));

    case OPEN_NOTIFICATIONS:
      return state.set('notificationsOpen', true);

    case CLOSE_NOTIFICATIONS:
      if(!state.getIn(['notifications', 'notifications'])) {
        return state.set('notificationsOpen', false);
      }
      return state.updateIn(['notifications', 'recent_msgs'],
                          (list) => state.getIn(['notifications', 'new_msgs']).concat(list))
                  .setIn(['notifications', 'new_msgs'], Immutable.fromJS([]))
                  .setIn(['notifications', 'notifications'], 0)
                  .set('notificationsOpen', false);

    case RETRIEVE_SOCKET_LOCATION:
    console.log('action', action.data);
      return state.set('socketLocation', action.data.ws_location);

    default:
      return state;
  }
}
