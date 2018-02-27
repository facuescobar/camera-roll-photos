/*
 * Store
 */

import { applyMiddleware, createStore, bindActionCreators } from 'redux';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import Actions from '../actions';
import Reducers from '../reducers';
import { reduce } from 'lodash';

export function configureStore(initialState = {}) {
  return createStore(
    combineReducers(Reducers),
    initialState,
    applyMiddleware(thunk),
  );
}

export function mapState(state) {
  const store = reduce(
    Reducers,
    (newState, newStore, key) => {
      if (state[key]) {
        newState[key] = { ...state[key] };
      }

      return newState;
    },
    {},
  );
  return { store };
}

export function mapActions(dispatch) {
  const actions = reduce(
    Actions,
    (apiActions, newActions, key) => {
      apiActions[key] = bindActionCreators(newActions, dispatch);
      return apiActions;
    },
    {},
  );
  return { actions };
}
