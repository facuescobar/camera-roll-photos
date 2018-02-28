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
      renderContent: false,
      infiniteScroll: false,
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
    const { actions, store } = this.props;

    this._updateLog(
      'loadMorePhotos:' +
        store.cameraRoll.photos.loading +
        store.cameraRoll.photos.loadMore.loading,
    );

    if (
      !store.cameraRoll.photos.loading &&
      !store.cameraRoll.photos.loadMore.loading &&
      store.cameraRoll.photos.loadMore.hasMore
    ) {
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

  toggleRenderContent = () => {
    this.setState(
      {
        renderContent: !this.state.renderContent,
      },
      () => {
        if (!this.state.renderContent && this.state.infiniteScroll) {
          this.toggleInfiniteScroll();
        }
      },
    );
  };

  toggleInfiniteScroll = () => {
    this.setState({
      infiniteScroll: !this.state.infiniteScroll,
    });
    this.resetPhotos();
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

  _renderGrayBar() {
    return <View style={{ backgroundColor: '#999', height: 40 }} />;
  }

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

  _renderLoading() {
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
    );
  }

  _renderStatusBar() {
    const { store } = this.props;
    return (
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
            fontSize: 14,
            fontWeight: '700',
            flex: 1,
          }}
        >
          {'Photos: '}
          {store.cameraRoll.photos.edges.length}
          {'\n'}
          {'InitialLoad: '}
          {store.cameraRoll.photos.error
            ? 'ERROR'
            : store.cameraRoll.photos.loading
              ? 'LOADING'
              : store.cameraRoll.photos.loaded ? 'LOADED' : 'NONE'}
          {'\n'}
          {'LoadMore: '}
          {store.cameraRoll.photos.loadMore.error
            ? 'ERROR'
            : store.cameraRoll.photos.loadMore.loading
              ? 'LOADING'
              : store.cameraRoll.photos.loadMore.loaded ? 'LOADED' : 'NONE'}
          {'\n'}
          {'HasMore: '}
          {String(store.cameraRoll.photos.loadMore.hasMore)}
        </Text>
        {!this.state.infiniteScroll &&
          store.cameraRoll.photos.loadMore.hasMore && (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={this.loadMorePhotos}
                style={{
                  justifyContent: 'center',
                  backgroundColor: 'coral',
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '700',
                    paddingHorizontal: 10,
                  }}
                >
                  {'Load More Photos'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        {!store.cameraRoll.photos.loadMore.hasMore && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}
            >
              {'ALL PHOTOS LOADED'}
            </Text>
          </View>
        )}
      </View>
    );
  }

  _renderToggleButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'darkred',
            height: 55,
          }}
        >
          <TouchableOpacity
            onPress={this.toggleRenderContent}
            disabled={this.state.copied}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: '700',
                paddingHorizontal: 5,
              }}
            >
              {this.state.renderContent ? 'Hide Photos' : 'Show Photos'}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.renderContent && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'darkcyan',
              height: 55,
            }}
          >
            <TouchableOpacity
              onPress={this.toggleInfiniteScroll}
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: '700',
                  paddingHorizontal: 10,
                }}
              >
                {this.state.infiniteScroll
                  ? 'Disable Infinite Scroll'
                  : 'Enable Infinite Scroll'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  _renderExtraButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'cornflowerblue',
            height: 55,
          }}
        >
          <TouchableOpacity
            onPress={this.resetPhotos}
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: '700',
                paddingHorizontal: 10,
              }}
            >
              {'RESET'}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'darkorange',
            height: 55,
          }}
        >
          <TouchableOpacity
            onPress={this.copyToClipboard}
            disabled={this.state.copied}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: '700',
                paddingHorizontal: 5,
              }}
            >
              {this.state.copied ? 'Done!' : 'COPY LOG TO CLIPBOARD'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderFlatlist() {
    const { store } = this.props;
    return (
      <FlatList
        data={store.cameraRoll.photos.edges}
        noDataText={'NO PHOTOS'}
        numColumns={3}
        renderItem={this.renderImage}
        onEndReached={this.state.infiniteScroll && this.loadMorePhotos}
        loadingMore={store.cameraRoll.photos.loadMore.loading}
      />
    );
  }

  render() {
    const { store } = this.props;

    return (
      <View style={Style.container}>
        {this._renderGrayBar()}
        {store.cameraRoll.photos.error ? (
          this._renderError()
        ) : !store.cameraRoll.photos.loaded ||
        store.cameraRoll.photos.loading ? (
          this._renderLoading()
        ) : (
          <View style={Style.container}>
            {this._renderStatusBar()}
            {this.state.renderContent ? (
              this._renderFlatlist()
            ) : (
              <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Text style={{ padding: 20 }}>
                  {'Click show photos to display them'}
                </Text>
              </View>
            )}
          </View>
        )}
        {this._renderToggleButtons()}
        {this._renderExtraButtons()}
        {this._renderGrayBar()}
      </View>
    );
  }
}

export default connect(mapState, mapActions)(CameraRollScreen);
