/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { createSelector } from 'reselect';
import {
  REQUEST_FAVORITES, RECEIVE_FAVORITES, FAIL_FAVORITES,
  ADD_FAVORITE, REMOVE_FAVORITE
} from '../actions/favorites.js';

export const favorites = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_FAVORITES:
      return {
        ...state,
        failure: false,
        isFetching: true
      };
    case RECEIVE_FAVORITES:
      return {
        ...state,
        items: action.items.reduce((obj, item) => {
            obj[item.id] = item;
            return obj;
          }, {}),
        failure: false,
        isFetching: false
      };
    case FAIL_FAVORITES:
      return {
        ...state,
        items: null,
        failure: true,
        isFetching: false
      };
    case ADD_FAVORITE:
      return {
        ...state,
        items: {
          ...state.items,
          [action.item.id]: action.item
        }
      }
    case REMOVE_FAVORITE:
      return {
        ...state,
        items: Object.keys(state.items).reduce((obj, key) => {
          if (key !== action.item.id) {
            obj[key] = state.items[key];
          }
          return obj;
        }, {}),
      }
    default:
      return state;
  }
}

export const favoritesSelector = state => state.favorites && state.favorites.items;

export const favoriteListSelector = createSelector(
  favoritesSelector,
  (items) => {
    if (!items) {
      return;
    }
    const itemList = Object.keys(items).map(key => items[key]);
    itemList.sort((a, b) => {
      return a.userInfo && b.userInfo && (a.userInfo.updated > b.userInfo.updated);
    });
    return itemList;
  }
);
