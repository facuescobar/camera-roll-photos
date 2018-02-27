/*
 * Camera Roll Screen
 */

import React, { Component } from 'react';
import { View, ImageBackground, Text, Image } from 'react-native';
import { CameraRollItemStyle } from '../../../styles/camera-roll';

export default class CameraRollItem extends Component {
  state = {
    selected: false,
  };

  render() {
    const { node, disabled, isLeft, isRight } = this.props;

    return (
      <View
        style={[
          CameraRollItemStyle.item,
          isLeft && CameraRollItemStyle.itemLeft,
          isRight && CameraRollItemStyle.itemRight,
        ]}
      >
        <Image
          source={{ uri: node.image.uri }}
          style={[
            CameraRollItemStyle.image,
            { flex: 1, backgroundColor: 'cornflowerblue' },
          ]}
        />
      </View>
    );
  }
}
