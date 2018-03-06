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
  const book = state.books && state.books.items[id];
  if (book) {
    // book found in state.books.items
    dispatch(receiveBook(id));
  } else {
    // fetch book data given the book id
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then(res => res.json())
      .then(data => dispatch(receiveBook(id, data)))
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
  debugger;
  return {
    type: FAIL_BOOK,
    id
  };
};

