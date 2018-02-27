/*
 * Flat List Styles
 */

import { StyleSheet } from 'react-native';
import { Layout, Color } from '../../';

export default StyleSheet.create({
  listFooterComponent: {
    backgroundColor: Color.transparent,
    paddingVertical: 25,
    justifyContent: 'center',
  },
  noData: {
    paddingVertical: Layout.paddingDouble * 1.5,
  },
  noDataText: {
    textAlign: 'center',
    color: Color.grayLight,
    fontSize: 12,
  },
});
