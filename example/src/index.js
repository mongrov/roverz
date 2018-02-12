/**
 * Index - this is where everything
 *  starts - but offloads to app.js
 */
/* global __DEV__ */
import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { connect, Provider } from 'react-redux';
// import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Router } from 'react-native-router-flux';
import {
  Analytics,
  AppUtil,
  AppStyles,
  rootReducer,
  Network,
} from 'roverz-chat';

// Consts and Libs
import AppRoutes from '@navigation/';
import AppConfig from '@app/config';

// first init global config
AppConfig.init();

// Connect RNRF with Redux
const RouterWithRedux = connect()(Router);

// Load middleware
let middleware = [
  Analytics,
  thunk, // Allows action creators to return functions (not just plain objects)
];

if (__DEV__) {
  // Dev-only middleware
  middleware = [
    ...middleware,
    // logger(), // Logs state changes to the dev console
  ];
}

// import MeteorOffline from 'react-native-meteor-redux';

// // initialize a MeteorOffline instance with options, currently just takes debounce
// // Do this at/near the top level of your app
// const GroundedMeteor = new MeteorOffline({debounce: 1000});

// // Now you can access MeteorStore as a redux store throughout your app.
// export {GroundedMeteor};

// Init redux store (using the given reducer & middleware)
const store = compose(
  applyMiddleware(...middleware),
)(createStore)(rootReducer);

AppUtil.debug(new Date().toLocaleString(), '[Performance] Main');

// lets initialize network
const n = new Network();
n.init();

export default function AppContainer() {
  return (
    <Provider store={store}>
      <RouterWithRedux scenes={AppRoutes} style={AppStyles.appContainer} />
    </Provider>
  );
}
