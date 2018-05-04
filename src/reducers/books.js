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
  REQUEST_BOOKS, RECEIVE_BOOKS, FAIL_BOOKS,
} from '../actions/books.js';

export const books = (state = {query: null}, action) => {
  switch (action.type) {
    case REQUEST_BOOKS:
      return {
        ...state,
        query: action.query,
        items: null, // reset items
        failure: false,
        isFetching: true
      };
    case RECEIVE_BOOKS:
      return {
        ...state,
        items: action.items.reduce((obj, item) => {
            obj[item.id] = item;
            return obj;
          }, {}),
        failure: false,
        isFetching: false
      };
    case FAIL_BOOKS:
      return {
        ...state,
        items: null,
        failure: true,
        isFetching: false
      };
    default:
      return state;
  }
}

export const itemsSelector = state => state.books && state.books.items;

export const itemListSelector = createSelector(
  itemsSelector,
  (items) => {
    return items ? Object.keys(items).map(key => items[key]) : [{},{},{},{},{}];
  }
);
