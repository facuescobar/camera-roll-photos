/*
 * Camera Roll Reducer
 */

import * as ActionTypes from '../actions/action-types';

const initialSaveState = {
  inProgress: false,
  success: false,
  error: null,
};

const initialLoadState = {
  loading: false,
  loaded: false,
  error: null,
};

const initialParamsState = {
  first: 1,
  assetType: 'Photos',
  groupTypes: 'All',
};

const initialGetPhotosState = {
  ...initialLoadState,
  edges: [],
  params: {
    ...initialParamsState,
  },
  initParams: {
    ...initialParamsState,
  },
  loadMore: {
    hasMore: true,
    ...initialLoadState,
  },
};

const initialState = {
  ACTION: 'init',
  mediaItem: null,
  save: {
    ...initialSaveState,
  },
  photos: {
    ...initialGetPhotosState,
  },
};

export default function cameraRoll(state = initialState, action = {}) {
  const { payload } = action;

  switch (action.type) {
    /*
     * Get Photos
     */

    case ActionTypes.CAMERA_ROLL_GET_PHOTOS_INIT: {
      return {
        ...state,
        ACTION: ActionTypes.CAMERA_ROLL_GET_PHOTOS_INIT,
        photos: {
          ...initialGetPhotosState,
        },
      };
    }
    case ActionTypes.CAMERA_ROLL_GET_PHOTOS_START: {
      return {
        ...state,
        ACTION: ActionTypes.CAMERA_ROLL_GET_PHOTOS_START,
        photos: {
          ...state.photos,
          loading: true,
        },
      };
    }
    case ActionTypes.CAMERA_ROLL_GET_PHOTOS_SUCCESS: {
      return {
        ...state,
        ACTION: ActionTypes.CAMERA_ROLL_GET_PHOTOS_SUCCESS,
        photos: {
          ...state.photos,
          ...payload.photos,
          edges: [...state.photos.edges, ...payload.photos.edges],
          params: {
            ...state.photos.params,
            after: payload.photos.pageInfo.endCursor,
          },
          loadMore: {
            ...state.photos.loadMore,
            hasMore: payload.photos.pageInfo.hasNextPage,
          },
          loading: false,
          loaded: true,
        },
      };
    }
    case ActionTypes.CAMERA_ROLL_GET_PHOTOS_FAILURE: {
      return {
        ...state,
        ACTION: ActionTypes.CAMERA_ROLL_GET_PHOTOS_FAILURE,
        photos: {
          ...state.photos,
          loading: false,
          error: payload.error,
        },
      };
    }

    /*
     * Get More Photos
     */

    case ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_START: {
      return {
        ...state,
        ACTION: ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_START,
        photos: {
          ...state.photos,
          loadMore: {
            ...state.photos.loadMore,
            loading: true,
          },
        },
      };
    }
    case ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_SUCCESS: {
      return {
        ...state,
        ACTION: ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_SUCCESS,
        photos: {
          ...state.photos,
          ...payload.photos,
          edges: [...state.photos.edges, ...payload.photos.edges],
          params: {
            ...state.photos.params,
            after: payload.photos.pageInfo.endCursor,
          },
          loadMore: {
            ...state.photos.loadMore,
            hasMore: payload.photos.pageInfo.hasNextPage,
            loading: false,
            loaded: true,
          },
        },
      };
    }
    case ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_FAILURE: {
      return {
        ...state,
        ACTION: ActionTypes.CAMERA_ROLL_GET_MORE_PHOTOS_FAILURE,
        photos: {
          ...state.photos,
          loadMore: {
            ...state.photos.loadMore,
            loading: false,
            error: payload.error,
          },
        },
      };
    }
  }
  return state;
}
