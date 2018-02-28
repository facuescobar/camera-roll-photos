/*
 * FlatList
 */

import React, { Component } from 'react';
import {
  View,
  FlatList as NativeFlatList,
  ActivityIndicator,
} from 'react-native';
import Style from '../../../styles/utils/flat-list';

/*
 * NOTE: FlatList with custom props to prevent incorrect load more behavior when infinite scroll is enabled
 */

export default class FlatList extends Component {
  static defaultProps = {
    onEndReachedThreshold: 0.1,
    keyExtractor: (item, index) => {
      return index;
    },
  };

  _onEndReachedCalledDuringMomentum = false;

  listFooterComponent = () => {
    return this.props.loadingMore ? (
      <View style={Style.listFooterComponent}>
        <ActivityIndicator />
      </View>
    ) : null;
  };

  render() {
    return (
      <NativeFlatList
        {...this.props}
        /* Load More */
        // onEndReached={() => {
        //   if (!this._onEndReachedCalledDuringMomentum) {
        //     if (this.props.onEndReached) {
        //       this.props.onEndReached();
        //     }
        //     this._onEndReachedCalledDuringMomentum = true;
        //   }
        // }}
        // onMomentumScrollBegin={() => {
        //   this._onEndReachedCalledDuringMomentum = false;
        //   if (this.props.onMomentumScrollBegin) {
        //     this.props.onMomentumScrollBegin();
        //   }
        // }}
        ListFooterComponent={
          this.props.ListFooterComponent || this.listFooterComponent()
        }
        onEndReachedThreshold={1}
      />
    );
  }
}
