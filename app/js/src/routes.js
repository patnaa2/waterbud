import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import HomePage from './containers/HomePage';
import HistoricalUsage from './containers/HistoricalUsage';
import LiveUsage from './containers/LiveUsage';
import Sensor from './containers/Sensors/sensor';
import Sensors from './containers/Sensors';
import Settings from './containers/Settings';
import NotFoundPage from './components/NotFoundPage';
import Tips from './containers/Tips';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="history" component={HistoricalUsage} />
    <Route path="live" component={LiveUsage} />
    <Route path="sensors" component={Sensors} />
    <Route path="sensor/:id" component={Sensor} />
    <Route path="settings" component={Settings} />
    <Route path="tips" component={Tips} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);
