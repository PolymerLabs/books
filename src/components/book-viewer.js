/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js';
import { connect } from '../../node_modules/pwa-helpers/connect-mixin.js';
import { updateMetadata } from '../../node_modules/pwa-helpers/metadata.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import { book, bookSelector } from '../reducers/book.js';
store.addReducers({
  book
});

// We want to export this action so it can be called after import() returns the module
export { fetchBook } from '../actions/book.js';

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

class BookViewer extends connect(store)(LitElement) {
  render({active, item}) {
    // Don't render if the page is not active.
    if (!active) {
      return;
    }

    if (item) {
      const info = item.volumeInfo;
      updateMetadata({
        title: `${info.title} - Books`,
        description: info.description,
        url: document.location.href,
        img: info.imageLinks.thumbnail.replace('http', 'https')
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
    active: Boolean,
    bookId: String,
    item: Object
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.bookId = state.book.id;
    this.item = bookSelector(state);
  }

  didRender({bookId, active}, changed, oldProps) {
    // google.books.Viewer requires the viewer to be visible when load(bookId) is called
    if (changed && 'active' in changed && active && bookId) {
      loadGoogleBooks().then(() => {
        this._viewer = new google.books.DefaultViewer(this.shadowRoot.querySelector('#viewer'));
        this._viewer.load(bookId);
      });
    }
  }
}

window.customElements.define('book-viewer', BookViewer);
