/*
 * Camera Roll Styles
 */

import { StyleSheet } from 'react-native';
import { Device } from '../../constants';
import { Layout, Color } from '../';

const itemSize = Device.width() / 3;
const checkBoxSize = itemSize * 0.15;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  activityIndicator: {
    padding: Layout.paddingDouble * 2,
  },
  sendButton: {
    position: 'absolute',
    right: Layout.marginDouble,
    bottom: Layout.marginDouble,
  },
});

export const CameraRollItemStyle = StyleSheet.create({
  item: {
    width: itemSize,
    height: itemSize,
    padding: 2,
    paddingTop: 0,
    paddingBottom: 4,
  },
  itemLeft: {
    paddingLeft: 0,
  },
  itemRight: {
    paddingRight: 0,
  },
  button: {
    flex: 1,
  },
  image: {
    flex: 1,
    backgroundColor: Color.grayLight,
  },
  checkbox: {
    marginTop: Layout.margin,
    marginLeft: Layout.margin,
    width: checkBoxSize,
    height: checkBoxSize,
    borderWidth: 2,
    borderColor: Color.white,
    borderRadius: checkBoxSize / 2,
    padding: 3,
  },
  checkboxBody: {
    flex: 1,
    backgroundColor: Color.white,
    borderRadius: checkBoxSize / 2,
  },
});
