/*
 * Camera Roll App
 */

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './src/store';
import CameraRoll from './src/components/camera-roll';

export default class App extends React.Component {
  store = configureStore();

  render() {
    return (
      <Provider store={this.store}>
        <CameraRoll />
      </Provider>
    );
  }
}
