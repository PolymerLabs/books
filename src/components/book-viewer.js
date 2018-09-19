/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// This element is connected to the redux store.
import { store } from '../store.js';

import { fetchBook } from '../actions/book.js';
import { book, bookSelector } from '../reducers/book.js';

// We are lazy loading its reducer.
store.addReducers({
  book
});

let initCalled;
const callbackPromise = new Promise((r) => window.__initGoogleBooks = r);

function loadGoogleBooks() {
  if (!initCalled) {
    const script = document.createElement('script');
    script.src = '//www.google.com/books/api.js?callback=__initGoogleBooks';
    document.head.appendChild(script);
    initCalled = true;
  }
  return callbackPromise;
}

class BookViewer extends connect(store)(PageViewElement) {
  render() {
    const { _item } = this;
    if (_item) {
      const info = _item.volumeInfo;
      updateMetadata({
        title: `${info.title} - Books`,
        description: info.description,
        image: info.imageLinks.thumbnail.replace('http', 'https')
      });
    }

    return html`
      <style>
        :host {
          display: block;
        }

        #viewer {
          width: 100%;
          height: 100%;
        }

        #viewer > div > div > div:nth-child(2) {
          display: none;
        }

        #viewer .overflow-scrolling {
          -webkit-overflow-scrolling: touch;
        }
      </style>

      <div id="viewer"></div>
    `;
  }

  static get properties() { return {
    _bookId: { type: String },
    _item: { type: Object }
  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._bookId = state.book.id;
    this._item = bookSelector(state);
  }

  updated(changedProps) {
    // google.books.Viewer requires the viewer to be visible when load(_bookId) is called
    if ((changedProps.has('active') || changedProps.has('_bookId')) && this.active && this._bookId) {
      loadGoogleBooks().then(() => {
        this._viewer = new google.books.DefaultViewer(this.shadowRoot.querySelector('#viewer'));
        this._viewer.load(this._bookId);
      });
    }
  }
}

window.customElements.define('book-viewer', BookViewer);

export { fetchBook };
