/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const REQUEST_BOOKS = 'REQUEST_BOOKS';
export const RECEIVE_BOOKS = 'RECEIVE_BOOKS';
export const FAIL_BOOKS = 'FAIL_BOOKS';

export const searchBooks = (query) => (dispatch, getState) => {
  // Check to see if the cached results are from the same query.
  // This is useful for avoiding a network request.
  if (shouldSearchBooks(getState(), query)) {
    dispatch(requestBooks(query));
    if (query) {
      const by = 'relevance';
      const fields = 'fields=items(id,volumeInfo/*,accessInfo(embeddable,country,viewability))';
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=${by}&${fields}&download=epub&maxResults=20`)
        .then(res => res.json())
        .then(data => dispatch(receiveBooks(query, data.items)))
        .catch(() => dispatch(failBooks(query)));
    } else {
      // query is empty, clear the results
      dispatch(receiveBooks(query, []));
    }
  }
};

const shouldSearchBooks = (state, query) => {
  return state.books.failure || state.books.query !== query && !state.books.isFetching;
}

const requestBooks = (query) => {
  return {
    type: REQUEST_BOOKS,
    query
  };
};

const receiveBooks = (query, items) => {
  return {
    type: RECEIVE_BOOKS,
    query,
    items
  };
};

const failBooks = (query) => {
  return {
    type: FAIL_BOOKS,
    query
  };
};
