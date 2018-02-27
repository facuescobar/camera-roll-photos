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
  log = [];
  logIndex = 0;

  constructor(props) {
    super(props);

    this.state = {
      selected: [],
    };
  }

  componentDidMount() {
    this._updateLog('componentDidMount:');
    this.initPhotos();
  }

  componentWillUnmount() {
    this._updateLog('componentWillUnmount:');
    this.resetPhotos();
  }

  componentDidUpdate() {
    this._updateLog('componentDidUpdate:');
    this._updateLog(this.props.store);
  }

  _updateLog(newLog) {
    debugger;
    this.log.push(newLog);
  }

  initPhotos = () => {
    this._updateLog('initPhotos:');
    const { actions, store } = this.props;
    actions.cameraRoll.getPhotos(store.cameraRoll.photos.initParams);
  };

  resetPhotos = () => {
    this._updateLog('resetPhotos:');
    const { actions } = this.props;
    actions.cameraRoll.resetPhotos();
    setTimeout(() => {
      this.initPhotos();
    });
  };

  loadMorePhotos = () => {
    this._updateLog('loadMorePhotos:');
    const { actions, store } = this.props;
    if (!store.cameraRoll.photos.loadMore.loading) {
      actions.cameraRoll.getMorePhotos(store.cameraRoll.photos.params);
    }
  };

  copyToClipboard = async () => {
    const { publicName, albumId } = this.props;

    await Clipboard.setString(JSON.stringify(this.log));

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
                  {'ST1: '}
                  {store.cameraRoll.photos.error
                    ? 'ERROR'
                    : store.cameraRoll.photos.loading
                      ? 'LOADING'
                      : store.cameraRoll.photos.loaded ? 'LOADED' : 'NONE'}
                  {' - ST2: '}
                  {store.cameraRoll.photos.loadMore.error
                    ? 'ERROR'
                    : store.cameraRoll.photos.loadMore.loading
                      ? 'LOADING'
                      : store.cameraRoll.photos.loadMore.loaded
                        ? 'LOADED'
                        : 'NONE'}
                </Text>
              </View>
              <FlatList
                data={store.cameraRoll.photos.edges}
                noDataText={'NO PHOTOS'}
                numColumns={3}
                renderItem={this.renderImage}
                onEndReached={this.loadMorePhotos}
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
