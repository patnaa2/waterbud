import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, compose(
    // Add other middleware on this line...
    applyMiddleware(thunk)
    )
  );
}
