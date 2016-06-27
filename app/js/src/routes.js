import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import HomePage from './containers/HomePage';
import NotFoundPage from './components/NotFoundPage';
import Tips from './containers/Tips';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="tips" component={Tips} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
