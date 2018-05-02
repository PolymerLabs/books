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
import { repeat } from 'lit-html/lib/repeat.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

import { BookButtonStyle } from './shared-styles.js';
import { closeIcon } from './book-icons.js';
import './book-item.js';
import './book-offline.js';

// This element is connected to the redux store.
import { store } from '../store.js';

import { refreshPage } from '../actions/app.js';
import { signIn } from '../actions/auth.js';
import { fetchFavorites, saveFavorite } from '../actions/favorites.js';
import { favorites } from '../reducers/favorites.js';

// We are lazy loading its reducer.
store.addReducers({
  favorites
});

class BookFavorites extends connect(store)(PageViewElement) {
  _render({ _items, _authInitialized, _user, _showOffline }) {
    updateMetadata({
      title: 'My Favorites - Books',
      description: 'My Favorites'
    });

    const itemList = _items ? Object.values(_items) : [];
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

      <section hidden="${_showOffline}">
        <div class="favorites-section" hidden="${!_authInitialized || !_user}">
          <div class="favorites-empty" hidden="${!_authInitialized || !_items || itemList.length}">
            <h3>Your favorites are empty</h3>
            <p>Go <a href="/explore">find some books</a> and add to your favorites</p>
          </div>
          <ul class="books">
            ${repeat(itemList, (item) => html`
              <li>
                <book-item item="${item}">
                  <button class="fav-button" title="Remove favorite" on-click="${(e) => this._removeFavorite(e, item)}">${closeIcon}</button>
                </book-item>
              </li>
            `)}
          </ul>
        </div>

        <div class="signin-section" hidden="${!_authInitialized || _user}">
          <p>Please sign in to see the favorites.</p>
          <button class="book-button" on-click="${() => store.dispatch(signIn())}">Sign in</button>
        </div>
      </section>

      <book-offline hidden="${!_showOffline}" on-refresh="${() => store.dispatch(refreshPage())}"></book-offline>
    `;
  }

  static get properties() { return {
    _items: Array,
    _authInitialized: Boolean,
    _user: Object,
    _showOffline: Boolean
  }}

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._items = state.favorites && state.favorites.items;
    this._authInitialized = state.auth.initialized;
    this._user = state.auth.user;
    this._showOffline = state.app.offline && state.favorites.failure;
  }

  _removeFavorite(e, item) {
    e.preventDefault();
    store.dispatch(saveFavorite(item, true));
  }
}

window.customElements.define('book-favorites', BookFavorites);

export { fetchFavorites };
