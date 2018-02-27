/*
 * Action Dispatcher
 */

export default class ActionDispatcher {
  _dispatch;

  constructor(dispatch) {
    this._dispatch = dispatch;
  }

  dispatch(type, payload) {
    this._dispatch({
      type,
      payload,
    });
  }
}
