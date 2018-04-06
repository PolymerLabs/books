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
import { itemsSelector } from './books.js';
import { favoritesSelector } from './favorites.js';
import {
  REQUEST_BOOK, RECEIVE_BOOK, FAIL_BOOK
} from '../actions/book.js';

export const book = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_BOOK:
      return {
        ...state,
        id: action.id,
        failure: false,
        isFetching: true
      };
    case RECEIVE_BOOK:
      return {
        ...state,
        item: action.item,
        failure: false,
        isFetching: false
      };
    case FAIL_BOOK:
      return {
        ...state,
        failure: true,
        isFetching: false
      };
    default:
      return state;
  }
}

const idSelector = state => state.book.id;
const itemSelector = state => state.book.item;

export const bookSelector = createSelector(
  idSelector,
  itemsSelector,
  favoritesSelector,
  itemSelector,
  (id, items, favorites, item) => {
    return items && items[id] || favorites && favorites[id] || item;
  }
);
