/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { initAuth } from './auth.js';

export const REQUEST_FAVORITES = 'REQUEST_FAVORITES';
export const RECEIVE_FAVORITES = 'RECEIVE_FAVORITES';
export const FAIL_FAVORITES = 'FAIL_FAVORITES';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';

export const fetchFavorites = (force) => (dispatch, getState) => {
  if (!force && !shouldFetchFavorites(getState())) {
    return;
  }
  initAuth(dispatch).then((GoogleAuth) => {
    dispatch(requestFavorites());
    if (!GoogleAuth.isSignedIn.get()) {
      dispatch(failFavorites());
      return;
    }
    let request = gapi.client.request({
      method: 'GET',
      path: 'books/v1/mylibrary/bookshelves/0/volumes'
    });
    // Execute the API request.
    request.execute((response) => {
      if (response.error) {
        dispatch(failFavorites());
      } else {
        dispatch(receiveFavorites(response.items || []));
      }
    });
  });
}

const shouldFetchFavorites = (state) => {
  return state.favorites && !state.favorites.isFetching && !state.favorites.items;
}

export const saveFavorite = (item, isRemove) => (dispatch) => {
  initAuth(dispatch).then((GoogleAuth) => {
    if (!GoogleAuth.isSignedIn.get()) {
      return;
    }
    let request = gapi.client.request({
      method: 'POST',
      path: `books/v1/mylibrary/bookshelves/0/${isRemove ? `removeVolume` : `addVolume`}?volumeId=${item.id}`
    });
    // Execute the API request.
    request.execute((response) => {
      dispatch(isRemove ? removeFavorite(item) : addFavorite(item));
    });
  });
}

const requestFavorites = () => {
  return {
    type: REQUEST_FAVORITES
  };
};

const receiveFavorites = (items) => {
  return {
    type: RECEIVE_FAVORITES,
    items
  };
};

const failFavorites = () => {
  return {
    type: FAIL_FAVORITES
  };
};

const addFavorite = (item) => {
  return {
    type: ADD_FAVORITE,
    item
  };
};

const removeFavorite = (item) => {
  return {
    type: REMOVE_FAVORITE,
    item
  };
};
