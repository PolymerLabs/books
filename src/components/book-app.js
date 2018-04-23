/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { menuIcon, backIcon, accountIcon } from './book-icons.js';
import './snack-bar.js'
import './book-input-decorator.js';
import './speech-mic.js';

import { store } from '../store.js';
import { navigate, updateOffline, updateWideLayout, showSnackbar, openDrawer, closeDrawer } from '../actions/app.js';
import { signIn, signOut, fetchUser } from '../actions/auth.js';

class BookApp extends connect(store)(LitElement) {
  render({
    appTitle,
    _page,
    _subTitle,
    _lastVisitedListPage,
    _offline,
    _wideLayout,
    _drawerOpened,
    _snackbarOpened,
    _authInitialized,
    _user,
    _query,
    _bookId
  }) {

    // Anything that's related to rendering should be done in here.

    // True to hide the menu button and show the back button.
    const hideMenuBtn = _page === 'detail' || _page === 'viewer';
    // True to hide the input.
    const hideInput = !_page || _page === 'favorites' || _page === 'about' || _page === '404';
    // True to make the search input aligns at the top inside the header instead of inside the main content.
    const inputAtTop = !_wideLayout || (_page === 'explore' && _query) || _page === 'detail' || _page === 'viewer';
    // back button href
    const backHref = _page === 'detail' ?
        (_lastVisitedListPage === 'favorites' ? '/favorites' : `/explore?q=${_query}`) : `/detail/${_bookId}`;

    return html`
    <style>
      :host {
        display: block;

        --app-drawer-width: 256px;
        --app-header-height: 128px;
        --app-footer-height: 104px;
        /* The 1px is to make the scrollbar appears all the time */
        --app-main-content-min-height: calc(100vh - var(--app-header-height) - var(--app-footer-height) + 1px);

        /* Default theme */
        --app-primary-color: #202020;
        --app-secondary-color: #202020;
        --app-dark-text-color: var(--app-secondary-color);
        --app-background-color: #fafafa;

        color: var(--app-dark-text-color);

        --app-drawer-background-color: var(--app-background-color);
        --app-drawer-text-color: var(--app-dark-text-color);
        --app-drawer-selected-color: var(--app-dark-text-color);
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background-color: var(--app-background-color);
        z-index: 1;
      }

      .toolbar-top {
        padding: 0 8px 0 8px;
      }

      .toolbar-bottom {
        justify-content: center;
        background-color: var(--app-background-color);
      }

      [main-title] > a {
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 0.1em;
        text-decoration: none;
        text-transform: uppercase;
        color: inherit;
        pointer-events: auto;
      }

      .subtitle {
        font-size: 18px;
        font-weight: normal;
      }

      book-input-decorator {
        max-width: 460px;
        transform: translate3d(0, 374px, 0);
      }

      book-input-decorator[top] {
        transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
        transform: translate3d(0, 0, 0);
      }

      .menu-btn,
      .back-btn,
      .signin-btn {
        display: inline-block;
        width: 40px;
        height: 40px;
        padding: 8px;
        box-sizing: border-box;
        background: none;
        border: none;
        fill: var(--app-header-text-color);
        cursor: pointer;
        text-decoration: none;
      }

      .signin-btn {
        padding: 2px;
        visibility: hidden;
      }

      .signin-btn[visible] {
        visibility: visible;
      }

      .signin-btn > img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }

      app-drawer {
        z-index: 2;
      }

      .drawer-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 24px;
        background: var(--app-drawer-background-color);
        position: relative;
      }

      .drawer-list > a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list > a[selected] {
        color: var(--app-drawer-selected-color);
        font-weight: bold;
      }

      .main-content {
        padding-top: var(--app-header-height);
        min-height: var(--app-main-content-min-height);
      }

      ._page {
        display: none;
      }

      ._page[active] {
        display: block;
      }

      book-viewer {
        height: var(--app-main-content-min-height);
      }

      footer {
        height: var(--app-footer-height);
        padding: 24px;
        box-sizing: border-box;
        text-align: center;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" aria-label="Menu" hidden?="${hideMenuBtn}"
            on-click="${() => this._drawerOpenedChanged(true)}">${menuIcon}</button>
        <a class="back-btn" aria-label="Go back" hidden?="${!hideMenuBtn}" href="${backHref}">${backIcon}</a>
        <div main-title><a href="/explore">${appTitle}</a></div>
        <button class="signin-btn" aria-label="Sign In" visible?="${_authInitialized}"
            on-click="${() =>  store.dispatch(_user && _user.imageUrl ? signOut() : signIn())}">
          ${_user && _user.imageUrl ? html`<img src="${_user.imageUrl}">` : accountIcon}
        </button>
      </app-toolbar>
      <app-toolbar class="toolbar-bottom" sticky>
        <book-input-decorator top?="${inputAtTop}" hidden="${hideInput}">
          <input slot="input" id="input" aria-label="Search Books" autofocus type="search" value="${_query}"
              on-change="${(e) => this._search(e.target.value)}">
          <speech-mic slot="button" continuous interimResults on-result="${(e) => this._micResult(e)}"></speech-mic>
        </book-input-decorator>
        <h4 class="subtitle" hidden="${!hideInput}">${_subTitle}</h4>
      </app-toolbar>
    </app-header>

    <!-- Drawer content -->
    <app-drawer opened="${_drawerOpened}" on-opened-changed="${e => this._drawerOpenedChanged(e.target.opened)}">
      <nav class="drawer-list" on-click="${e => this._drawerOpenedChanged(false)}">
        <a selected?="${_page === 'explore'}" href="/explore?q=${_query}">Home</a>
        <a selected?="${_page === 'favorites'}" href="/favorites">Favorites</a>
        <a selected?="${_page === 'about'}" href="/about">About</a>
      </nav>
    </app-drawer>

    <!-- Main content -->
    <main class="main-content">
      <book-home class="_page" active?="${_page === 'home'}"></book-home>
      <book-explore class="_page" active?="${_page === 'explore'}"></book-explore>
      <book-detail class="_page" active?="${_page === 'detail'}"></book-detail>
      <book-viewer class="_page" active?="${_page === 'viewer'}"></book-viewer>
      <book-favorites class="_page" active?="${_page === 'favorites'}"></book-favorites>
      <book-about class="_page" active?="${_page === 'about'}"></book-about>
      <book-404 class="_page" active?="${_page === '404'}"></book-404>
    </main>

    <footer>
      <p>Made with &lt;3 by the Polymer team.</p>
    </footer>

    <snack-bar active?="${_snackbarOpened}">
        You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: String,
      _page: String,
      _subTitle: String,
      _lastVisitedListPage: Boolean,
      _offline: Boolean,
      _wideLayout: Boolean,
      _drawerOpened: Boolean,
      _snackbarOpened: Boolean,
      _authInitialized: Boolean,
      _user: Object,
      _query: String,
      _bookId: String
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
    setPassiveTouchGestures(true);
  }

  didRender(props, changed) {
    if ('_page' in changed) {
      window.scrollTo(0, 0);
    }
  }

  ready() {
    super.ready();
    installRouter((location) => store.dispatch(navigate(location)));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 648px) and (min-height: 648px)`,
        (matches) => store.dispatch(updateWideLayout(matches)));
    store.dispatch(fetchUser());
    this._input = this.shadowRoot.getElementById('input');
    this._afterReady = true;
  }

  stateChanged(state) {
    this._page = state.app.page;
    this._subTitle = state.app.subTitle;
    this._lastVisitedListPage = state.app.lastVisitedListPage;
    this._offline = state.app.offline;
    this._wideLayout = state.app.wideLayout;
    this._drawerOpened = state.app.drawerOpened;
    this._snackbarOpened = state.app.snackbarOpened;
    this._authInitialized = state.auth.initialized;
    this._user = state.auth.user;
    this._query = state.books && state.books.query || '';
    this._bookId = state.book && state.book.id;
  }

  _offlineChanged(offline) {
    store.dispatch(updateOffline(offline));
    // Don't show the snackbar on the first load of the page.
    if (this._afterReady) {
      store.dispatch(showSnackbar());
    }
  }

  _drawerOpenedChanged(opened) {
    if (opened !== this._drawerOpened) {
      store.dispatch(opened ? openDrawer() : closeDrawer());
    }
  }

  _search(value) {
    window.history.pushState({}, '', `/explore?q=${value}`);
    store.dispatch(navigate(window.location));
  }

  _micResult(e) {
    const d = e.detail;
    const value = d.completeTranscript;
    this._input.value = value;
    if (d.isFinal) {
      this._search(value);
    }
  }
}

window.customElements.define('book-app', BookApp);
