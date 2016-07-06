/* eslint-disable import/default */
import './index.less';
import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import routes from './routes';
import configureStore from './store/configureStore';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
const store = configureStore();

render(
  <Provider store={store}>
    <Router history={appHistory} routes={routes} />
  </Provider>, document.getElementById('app')
);
