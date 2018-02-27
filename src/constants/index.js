/*
 * Constants
 */

import { Platform as NativePlatform, Dimensions } from 'react-native';

export const Platform = {
  isAndroid: NativePlatform.OS === 'android',
  isIOS: NativePlatform.OS === 'ios',
  os: NativePlatform.OS,
};

export const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const StatusBar = {
  width: Screen.width,
  height: NativePlatform.select({
    ios: 20,
    android: 24,
  }),
  widthOnScreen: Screen.width,
  heightOnScreen: NativePlatform.select({
    ios: 20,
    android: 0,
  }),
};

export const Device = {
  width: () => {
    return Screen.width;
  },
  height: full => {
    if (full && Platform.isIOS) {
      return Screen.height;
    }

    return Screen.height - StatusBar.height;
  },
};

