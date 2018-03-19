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
import { installRouter } from '../../node_modules/pwa-helpers/router.js';
import { installOfflineWatcher } from '../../node_modules/pwa-helpers/network.js';
import { installMediaQueryWatcher } from '../../node_modules/pwa-helpers/media-query.js';

import '../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js';
import '../../node_modules/@polymer/app-layout/app-header/app-header.js';
import '../../node_modules/@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js';
import { setPassiveTouchGestures } from '../../node_modules/@polymer/polymer/lib/utils/settings.js';
import { menuIcon, backIcon } from './book-icons.js';
import { responsiveWidth } from './shared-styles.js';
import './snack-bar.js'
import './book-input-decorator.js';

import { store } from '../store.js';
import { navigate, updateOffline, updateWideLayout, showSnackbar, openDrawer, closeDrawer } from '../actions/app.js';

class BookApp extends connect(store)(LitElement) {
  render({page, appTitle, drawerOpened, snackbarOpened, offline, wideLayout, query, bookId}) {
    // Anything that's related to rendering should be done in here.

    // True to hide the menu button and show the back button.
    const hideMenuBtn = page === 'detail' || page === 'viewer';
    // True to hide the input.
    const hideInput = !page || page === 'about' || page === '404';
    // True to make the search input aligns at the top inside the header instead of inside the main content.
    const inputAtTop = !wideLayout || (page === 'explore' && query) || page === 'detail' || page === 'viewer';

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
        padding: 0 52px 0 8px;
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

      book-input-decorator {
        max-width: 400px;
        transform: translate3d(0, 374px, 0);
      }

      book-input-decorator[top] {
        transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
        transform: translate3d(0, 0, 0);
      }

      .menu-btn,
      .back-btn {
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

      .drawer-list a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list a[selected] {
        color: var(--app-drawer-selected-color);
        font-weight: bold;
      }

      .main-content {
        padding-top: var(--app-header-height);
        min-height: var(--app-main-content-min-height);
      }

      .main-content .page {
        display: none;
      }

      .main-content .page[active] {
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

      /* Wide layout */
      @media (min-width: ${responsiveWidth}) {
        .toolbar-top {
          padding: 0 60px 0 16px;
        }
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" hidden?="${hideMenuBtn}" on-click="${_ => this._drawerOpenedChanged(true)}">${menuIcon}</button>
        <a class="back-btn" hidden?="${!hideMenuBtn}"
            href="${page === 'detail' ? `/explore?q=${query}` : `/detail/${bookId}`}">${backIcon}</a>
        <div main-title><a href="/explore">${appTitle}</a></div>
      </app-toolbar>
      <app-toolbar class="toolbar-bottom" sticky>
        <book-input-decorator top?="${inputAtTop}" hidden="${hideInput}">
          <input slot="input" autofocus type="search" value="${query}" on-change="${(e) => this._search(e)}">
        </book-input-decorator>
      </app-toolbar>
    </app-header>

    <!-- Drawer content -->
    <app-drawer opened="${drawerOpened}" on-opened-changed="${e => this._drawerOpenedChanged(e.target.opened)}">
      <nav class="drawer-list" on-click="${e => this._drawerOpenedChanged(false)}">
        <a selected?="${page === 'explore'}" href="/explore?q=${query}">Home</a>
        <a selected?="${page === 'about'}" href="/about">About</a>
      </nav>
    </app-drawer>

    <!-- Main content -->
    <main class="main-content">
      <book-home class="page" active?="${page === 'home'}"></book-home>
      <book-explore class="page" active?="${page === 'explore'}"></book-explore>
      <book-detail class="page" active?="${page === 'detail'}"></book-detail>
      <book-viewer class="page" active?="${page === 'viewer'}"></book-viewer>
      <book-about class="page" active?="${page === 'about'}"></book-about>
      <book-404 class="page" active?="${page === '404'}"></book-404>
    </main>

    <footer>
      <p>Made with &lt;3 by the Polymer team.</p>
    </footer>

    <snack-bar active?="${snackbarOpened}">
        You are now ${offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      page: String,
      appTitle: String,
      drawerOpened: Boolean,
      snackbarOpened: Boolean,
      offline: Boolean,
      wideLayout: Boolean,
      query: String,
      bookId: String
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
    setPassiveTouchGestures(true);
  }

  didRender(props, changed) {
    if ('page' in changed) {
      window.scrollTo(0, 0);
    }
  }

  ready() {
    super.ready();
    installRouter((location) => store.dispatch(navigate(location)));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: ${responsiveWidth})`,
        (matches) => store.dispatch(updateWideLayout(matches)));
    this._readied = true;
  }

  stateChanged(state) {
    this.page = state.app.page;
    this.offline = state.app.offline;
    this.wideLayout = state.app.wideLayout;
    this.snackbarOpened = state.app.snackbarOpened;
    this.drawerOpened = state.app.drawerOpened;
    this.query = state.books && state.books.query || '';
    this.bookId = state.book && state.book.id;
  }

  _offlineChanged(offline) {
    store.dispatch(updateOffline(offline));
    // Don't show the snackbar on the first load of the page.
    if (this._readied) {
      store.dispatch(showSnackbar());
    }
  }

  _drawerOpenedChanged(opened) {
    if (opened !== this.drawerOpened) {
      store.dispatch(opened ? openDrawer() : closeDrawer());
    }
  }

  _search(e) {
    const params = new URLSearchParams();
    params.set('q', e.target.value);
    window.history.pushState({}, '', `explore?${params.toString()}`);
    store.dispatch(navigate(window.location));
  }
}

window.customElements.define('book-app', BookApp);
