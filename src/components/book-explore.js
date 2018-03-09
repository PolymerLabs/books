/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '../../node_modules/@polymer/lit-element/lit-element.js';
import { repeat } from '../../node_modules/lit-html/lib/repeat.js';
import { connect } from '../../node_modules/pwa-helpers/connect-mixin.js';
import { updateMetadata } from '../../node_modules/pwa-helpers/metadata.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import { books, itemsArraySelector } from '../reducers/books.js';
store.addReducers({
  books
});

// We want to export this action so it can be called after import() returns the module
export { searchBooks } from '../actions/books.js';

import { refreshPage } from '../actions/app.js';

import { PageViewElement } from './page-view-element.js';
import { responsiveWidth, responsiveWiderWidth } from './shared-styles.js';
import './book-image.js';
import './book-featured-item.js';
import './book-item.js';
import './book-offline.js';

class BookExplore extends connect(store)(PageViewElement) {
  render({query, items, showOffline}) {
    updateMetadata({
      title: `${query ? `${query} - ` : ''}Books`,
      description: 'Search for books'
    });

    let featuredItem = items[0];
    let otherItems = items.slice(1);

    return html`
      <style>
        :host {
          display: block;
        }

        .books {
          width: 100%;
          margin: 0 auto;
          padding: 8px;
          box-sizing: border-box;
          /* remove margin between inline-block nodes */
          font-size: 0;
        }

        li {
          display: inline-block;
          position: relative;
          width: calc(50% - 16px);
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
          padding-top: 190%;
        }

        li.featured {
          width: calc(100% - 16px);
        }

        li.featured::after {
          content: '';
          display: block;
          padding-top: 60%;
        }

        .books-bg {
          height: 300px;
          max-width: 600px;
          margin: 0 auto;
        }

        [hidden] {
          display: none !important;
        }

        /* Wide layout: 3 columns */
        @media (min-width: ${responsiveWidth}) {
          .books {
            width: 616px;
            padding: 16px 0;
          }

          li {
            width: calc(100% / 3 - 16px);
          }

          li.featured {
            width: calc(100% / 3 * 2 - 16px);
          }

          li.featured::after {
            padding-top: calc(95% - 16px);
          }
        }

        /* Wide layout: 4 columns */
        @media (min-width: ${responsiveWiderWidth}) {
          .books {
            width: 816px;
          }

          li {
            width: calc(25% - 16px);
          }

          li.featured {
            width: calc(50% - 16px);
          }
        }
      </style>

      <section hidden="${showOffline}">
        <ul class="books" hidden="${!query || items.length === 0}">
          <li class="featured">
            <book-featured-item item="${featuredItem}"></book-featured-item>
          </li>
          ${repeat(otherItems, (item) => html`
            <li>
              <book-item item="${item}"></book-item>
            </li>
          `)}
        </ul>

        <book-image class="books-bg" center src="images/books-bg.jpg" hidden="${query}" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAAI0lEQVR4AWPw2v7Wfe1Dj7X3/Pd8YPDf+Uqva79x38GQvW8Bu0sOexptskUAAAAASUVORK5CYII="></book-image>
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
    // Using memorized selector to avoid calling Object.values(state.books.items)
    // every time the state is changed.
    this.items = itemsArraySelector(state);
    this.showOffline = state.app.offline && state.books.failure;
  }
}

window.customElements.define('book-explore', BookExplore);
