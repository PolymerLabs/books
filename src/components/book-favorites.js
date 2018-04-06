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
import { repeat } from 'lit-html/lib/repeat.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// This element is connected to the redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import { favorites } from '../reducers/favorites.js';
store.addReducers({
  favorites
});

// We want to export this action so it can be called after import() returns the module
export { fetchFavorites } from '../actions/favorites.js';
import { saveFavorite } from '../actions/favorites.js';
import { signIn } from '../actions/auth.js';

import { refreshPage } from '../actions/app.js';

import { PageViewElement } from './page-view-element.js';
import { BookButtonStyle } from './shared-styles.js';
import { closeIcon } from './book-icons.js';
import './book-item.js';
import './book-offline.js';

class BookFavorites extends connect(store)(PageViewElement) {
  render({items, authInitialized, user, showOffline}) {
    updateMetadata({
      title: 'My Favorites - Books',
      description: 'My Favorites'
    });

    const itemList = items ? Object.values(items) : [];
    itemList.sort((a, b) => {
      return a.userInfo && b.userInfo && (a.userInfo.updated > b.userInfo.updated);
    });

    return html`
      ${BookButtonStyle}
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

        h3 {
          text-align: center;
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 0;
        }

        .signin-section {
          text-align: center;
        }

        .fav-button {
          width: 32px;
          height: 32px;
          padding: 2px;
          margin: 0;
          border: 2px solid;
          background: transparent;
          -webkit-appearance: none;
          cursor: pointer;
        }

        .fav-button > svg {
          width: 24px;
          height: 24px;
        }

        .favorites-empty {
          text-align: center;
        }

        [hidden] {
          display: none !important;
        }

        /* Wide Layout */
        @media (min-width: 648px) {
          li {
            height: 364px;
          }
        }

        /* Wider layout: 2 columns */
        @media (min-width: 872px) {
          .books {
            width: 832px;
            max-width: none;
            padding: 16px 0;
          }
        }
      </style>

      <section hidden="${showOffline}">
        <div class="favorites-section" hidden="${!authInitialized || !user}">
          <div class="favorites-empty" hidden="${!authInitialized || (!items || itemList.length)}">
            <h3>Your favorites are empty</h3>
            <p>Go <a href="/explore">find some books</a> and add to your favorites</p>
          </div>
          <ul class="books">
            ${repeat(itemList, (item) => html`
              <li>
                <book-item item="${item}">
                  <button class="fav-button" on-click="${(e) => this._removeFavorite(e, item)}">${closeIcon}</button>
                </book-item>
              </li>
            `)}
          </ul>
        </div>

        <div class="signin-section" hidden="${!authInitialized || user}">
          <p>Please sign in to see the favorites.</p>
          <button class="book-button" on-click="${() => store.dispatch(signIn())}">Sign in</button>
        </div>
      </section>

      <book-offline hidden="${!showOffline}" on-refresh="${() => store.dispatch(refreshPage())}"></book-offline>
    `;
  }

  static get properties() { return {
    items: Array,
    authInitialized: Boolean,
    user: Object,
    showOffline: Boolean
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.items = state.favorites && state.favorites.items;
    this.authInitialized = state.auth.initialized;
    this.user = state.auth.user;
    this.showOffline = state.app.offline && state.favorites.failure;
  }

  _removeFavorite(e, item) {
    e.preventDefault();
    store.dispatch(saveFavorite(item, true));
  }
}

window.customElements.define('book-favorites', BookFavorites);
