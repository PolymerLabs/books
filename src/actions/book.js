/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const REQUEST_BOOK = 'REQUEST_BOOK';
export const RECEIVE_BOOK = 'RECEIVE_BOOK';
export const FAIL_BOOK = 'FAIL_BOOK';

export const fetchBook = (id) => (dispatch, getState) => {
  dispatch(requestBook(id));
  const state = getState();
  const book = state.books && state.books.items && state.books.items[id] ||
      state.favorites && state.favorites.items && state.favorites.items[id];
  if (book) {
    // book found in state.books.items or state.favorites.items
    dispatch(receiveBook(id));
    // let the calling code know there's nothing to wait for.
    return Promise.resolve();
  } else {
    // fetch book data given the book id.
    // also return a promise to wait for.
    return fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          dispatch(failBook(id));
        } else {
          dispatch(receiveBook(id, data));
        }
      })
      .catch((e) => dispatch(failBook(id)));
  }
};

const requestBook = (id) => {
  return {
    type: REQUEST_BOOK,
    id
  };
};

const receiveBook = (id, item) => {
  return {
    type: RECEIVE_BOOK,
    id,
    item
  };
};

const failBook = (id) => {
  return {
    type: FAIL_BOOK,
    id
  };
};

