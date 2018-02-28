/*
 * Camera Roll Actions
 */

import { CameraRoll } from 'react-native';
import * as ActionTypes from './action-types';
import ActionDispatcher from './action-dispatcher';
import camelcaseKeys from 'camelcase-keys-deep';

/*
 * getPhotos
 * @Description: get photos from camera roll
 */

export function getPhotos(options) {
  return async dispatch => {
    const dispatcher = new ActionDispatcher(dispatch);
    try {
      dispatcher.dispatch(ActionTypes.CAMERA_ROLL_GET_PHOTOS_START);
      const photos = await CameraRoll.getPhotos(options);

      dispatcher.dispatch(ActionTypes.CAMERA_ROLL_GET_PHOTOS_SUCCESS, {
        photos: camelcaseKeys(photos),
      });
    } catch (error) {
      console.warn('getPhotos : Error');
      console.log(error);
      dispatcher.dispatch(ActionTypes.CAMERA_ROLL_GET_PHOTOS_FAILURE, {
        error,
      });
    }
  };
}

/*
 * getMorePhotos
 * @Description: get more photos from camera roll
 */

export function getMorePhotos(options) {
  return async dispatch => {
    const dispatcher = new ActionDispatcher(dispatch);
    try {
      dispatcher.dispatch(ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_START);

      const photos = await CameraRoll.getPhotos(options);

      dispatcher.dispatch(ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_SUCCESS, {
        photos: camelcaseKeys(photos),
      });
    } catch (error) {
      console.warn('getMorePhotos : Error', error);
      console.log(error);
      dispatcher.dispatch(ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_FAILURE, {
        error,
      });
    }
  };
}

/*
 * resetPhotos
 * @Description: reset photos store
 */

export function resetPhotos() {
  return async dispatch => {
    const dispatcher = new ActionDispatcher(dispatch);
    try {
      dispatcher.dispatch(ActionTypes.CAMERA_ROLL_GET_PHOTOS_INIT);
    } catch (error) {
      console.warn('resetPhotos : Error');
      console.log(error);
    }
  };
}

/*
 * Default
 */

export default {
  getPhotos,
  getMorePhotos,
  resetPhotos,
};
