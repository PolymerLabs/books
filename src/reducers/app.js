/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { UPDATE_PAGE, RECEIVE_LAZY_RESOURCES, UPDATE_SUBTITLE, UPDATE_OFFLINE, UPDATE_WIDE_LAYOUT,
         OPEN_SNACKBAR, CLOSE_SNACKBAR, UPDATE_DRAWER_STATE } from '../actions/app.js';

const app = (state = {drawerOpened: false}, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      const p = action.page;
      return {
        ...state,
        page: p,
        lastVisitedListPage: p === 'explore' || p === 'favorites' ? p : state.lastVisitedListPage
      };
    case RECEIVE_LAZY_RESOURCES:
      return {
        ...state,
        lazyResourcesLoaded: true
      };
    case UPDATE_SUBTITLE:
      return {
        ...state,
        subTitle: action.subTitle
      };
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    case UPDATE_WIDE_LAYOUT:
      return {
        ...state,
        wideLayout: action.wide
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      };
    default:
      return state;
  }
}

export default app;
