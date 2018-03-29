/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element/lit-element.js';
import { repeat } from 'lit-html/lib/repeat.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import { books } from '../reducers/books.js';
store.addReducers({
  books
});

// We want to export this action so it can be called after import() returns the module
export { searchBooks } from '../actions/books.js';

import { refreshPage } from '../actions/app.js';

import { PageViewElement } from './page-view-element.js';
import { responsiveWidth, responsiveWiderWidth } from './shared-styles.js';
import './book-image.js';
import './book-item.js';
import './book-offline.js';

class BookExplore extends connect(store)(PageViewElement) {
  render({query, items, showOffline}) {
    updateMetadata({
      title: `${query ? `${query} - ` : ''}Books`,
      description: 'Search for books'
    });

    // actual items or placeholder items if the items haven't loaded yet.
    const itemList = items ? Object.values(items) : [{},{},{},{},{}];

    return html`
      <style>
        :host {
          display: block;
        }

        .books {
          max-width: 432px;
          margin: 0 auto;
          padding: 8px;
          box-sizing: border-box;
          /* remove margin between inline-block nodes */
          font-size: 0;
        }

        li {
          display: inline-block;
          position: relative;
          width: calc(100% - 16px);
          max-width: 400px;
          min-height: 240px;
          margin: 8px;
          font-size: 14px;
          vertical-align: top;
          background: #fff;
          border-radius: 2px;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
          list-style: none;
        }

        li::after {
          content: '';
          display: block;
          padding-top: 65%;
        }

        .books-bg {
          height: 300px;
          max-width: 570px;
          margin: 0 auto;
        }

        .books-desc {
          padding: 24px 16px 0;
          text-align: center;
        }

        [hidden] {
          display: none !important;
        }

        /* Wide Layout */
        @media (min-width: ${responsiveWidth}) {
          li {
            height: 364px;
          }

          .books-desc {
            padding: 96px 16px 0;
          }
        }

        /* Wider layout: 2 columns */
        @media (min-width: ${responsiveWiderWidth}) {
          .books {
            width: 832px;
            max-width: none;
            padding: 16px 0;
          }
        }
      </style>

      <section hidden="${showOffline}">
        <ul class="books" hidden="${!query}">
          ${repeat(itemList, (item) => html`
            <li>
              <book-item item="${item}"></book-item>
            </li>
          `)}
        </ul>

        <book-image class="books-bg" alt="Books Home" center src="images/books-bg.jpg" hidden="${query}" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAAI0lEQVR4AWPw2v7Wfe1Dj7X3/Pd8YPDf+Uqva79x38GQvW8Bu0sOexptskUAAAAASUVORK5CYII="></book-image>

        <div class="books-desc" hidden="${query}">Search the world's most comprehensive index of full-text books.</div>
      </section>

      <book-offline hidden="${!showOffline}" on-refresh="${() => store.dispatch(refreshPage())}"></book-offline>
    `;
  }

  static get properties() { return {
    query: String,
    items: Array,
    showOffline: Boolean
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.query = state.books.query;
    this.items = state.books && state.books.items;
    this.showOffline = state.app.offline && state.books.failure;
  }
}

window.customElements.define('book-explore', BookExplore);
