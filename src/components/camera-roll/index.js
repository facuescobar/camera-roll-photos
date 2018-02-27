/*
 * Camera Roll Screen
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Clipboard,
} from 'react-native';
import { connect } from 'react-redux';
import { mapState, mapActions } from '../../store';
import CameraRollItem from './modules/camera-roll-item';
import FlatList from '../utils/flat-list';
import Style from '../../styles/camera-roll';

class CameraRollScreen extends Component {
  constructor(props) {
    super(props);

    log = '';

    this.state = {
      selected: [],
    };
  }

  componentDidMount() {
    this.initPhotos();
  }

  componentWillUnmount() {
    this.resetPhotos();
  }

  componentDidUpdate() {
    this.log = this.log + '\n' + JSON.stringify(this.props.store);
    console.log('####### INIT');
    console.log(JSON.stringify(this.props.store));
    console.log('####### END');
  }

  initPhotos = () => {
    const { actions, store } = this.props;
    actions.cameraRoll.getPhotos(store.cameraRoll.photos.initParams);
  };

  resetPhotos = () => {
    const { actions } = this.props;
    actions.cameraRoll.resetPhotos();
    setTimeout(() => {
      this.initPhotos();
    });
  };

  loadMorePhotos = () => {
    const { actions, store } = this.props;
    actions.cameraRoll.getMorePhotos(store.cameraRoll.photos.params);
  };

  copyToClipboard = async () => {
    const { publicName, albumId } = this.props;

    await Clipboard.setString(this.log);

    console.log('####### INIT');
    console.log(this.log);
    console.log('####### END');

    this.setState(
      {
        copied: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            copied: false,
          });
        }, 1000);
      },
    );
  };

  renderImage = ({ item, index }) => {
    return (
      <CameraRollItem
        node={{
          ...item.node,
          index,
        }}
        isLeft={(index + 1) % 3 === 1}
        isRight={(index - 1) % 3 === 1}
        onSelect={this.onSelectItem}
        onUnselect={this.onUnselectItem}
      />
    );
  };

  _renderError() {
    const { store } = this.props;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'crimson',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 32 }}>
          {'ERROR'}
        </Text>
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 22 }}>
          {JSON.stringify(store.cameraRoll.photos.error)}
        </Text>
      </View>
    );
  }

  render() {
    const { store } = this.props;

    return (
      <View style={Style.container}>
        <View style={{ backgroundColor: '#999', height: 40 }} />
        {store.cameraRoll.photos.error ? (
          this._renderError()
        ) : !store.cameraRoll.photos.loaded ||
        store.cameraRoll.photos.loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'crimson',
            }}
          >
            <ActivityIndicator size={'large'} color={'white'} />
            <Text
              style={{
                textAlign: 'center',
                padding: 20,
                color: 'white',
                fontWeight: '700',
                fontSize: 12,
              }}
            >
              {'LOADING'}
            </Text>
          </View>
        ) : (
          <View style={Style.container}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'crimson',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    padding: 10,
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  {'Photos: '}
                  {store.cameraRoll.photos.edges.length}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    padding: 10,
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  {'Status: '}
                  {store.cameraRoll.photos.error
                    ? 'ERROR'
                    : store.cameraRoll.photos.loading
                      ? 'LOADING'
                      : store.cameraRoll.photos.loaded ? 'LOADED' : 'UNKNOWN'}
                </Text>
              </View>
              <FlatList
                data={store.cameraRoll.photos.edges}
                noDataText={'NO PHOTOS'}
                numColumns={3}
                renderItem={this.renderImage}
                onEndReached={this.loadMorePhotos}
                onEndReachedThreshold={1}
                loadingMore={store.cameraRoll.photos.loadMore.loading}
              />
            </View>

            <TouchableOpacity
              onPress={this.copyToClipboard}
              disabled={this.state.copied}
            >
              <Text
                style={{
                  textAlign: 'center',
                  padding: 20,
                  color: 'white',
                  fontWeight: '700',
                  fontSize: 18,
                  backgroundColor: 'darkorange',
                }}
              >
                {this.state.copied ? 'Done!' : 'COPY LOG TO CLIPBOARD'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.resetPhotos}>
              <Text
                style={{
                  textAlign: 'center',
                  padding: 10,
                  color: 'white',
                  fontWeight: '700',
                  fontSize: 18,
                  backgroundColor: 'cornflowerblue',
                }}
              >
                {'RESET'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default connect(mapState, mapActions)(CameraRollScreen);
