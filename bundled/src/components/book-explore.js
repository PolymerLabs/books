import { LitElement, html, unsafeHTML, responsiveWidth, responsiveWiderWidth, repeat, connect, updateMetadata, store, books, itemsArraySelector, refreshPage } from './book-app.js';

export const searchBooks;


/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

class BookFeaturedItem extends LitElement {
  render({ item }) {
    let info = item && item.volumeInfo;
    let author = info ? info.authors && info.authors.join(', ') : '';
    let thumbnail = info ? info.imageLinks.thumbnail.replace('http', 'https') : '';
    let date = info ? new Date(info.publishedDate).getFullYear() : '';

    return html`
      <style>
        :host {
          display: block;
        }

        a {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          color: inherit;
          text-decoration: none;
        }

        .info {
          display: flex;
          flex-direction: row-reverse;
        }

        .desc {
          position: relative;
          flex: 1;
          margin: 8px 12px;
          box-sizing: border-box;
          font-size: 14px;
          font-weight: 300;
          line-height: 1.5;
          overflow: hidden;
        }

        .desc::after {
          content: '';
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 40px;
        }

        book-image {
          width: 25%;
          pointer-events: none;
        }

        book-image::before {
          content: "";
          display: block;
          padding-top: 160%;
        }

        .info-desc {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin: 8px 8px 8px 16px;
          font-size: 14px;
          font-weight: 300;
          overflow: hidden;
        }

        .title {
          position: relative;
          margin: 0;
          box-sizing: border-box;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.1px;
          line-height: 1.2;
        }

        .author {
          line-height: 1.4;
        }

        .info-item {
          padding-top: 8px;
        }

        [hidden] {
          display: none !important;
        }

        /* Wide layout */
        @media (min-width: ${responsiveWidth}) {
          .info {
            flex-direction: row;
          }

          book-image {
            width: 40%;
          }

          .title {
            font-size: 20px;
          }

          .info-item {
            padding-top: 12px;
          }

          .desc {
            margin: 8px 16px;
          }

          .info-desc {
            margin: 16px;
          }
        }
      </style>

      <a href="/detail/${item ? item.id : ''}" hidden="${!info}">
        <div class="info">
          <book-image src="${thumbnail}"></book-image>
          <div class="info-desc">
            <h2 class="title">${info ? info.title : ''}</h2>
            <div class="author info-item" hidden="${!author}">${author} - ${date}</div>
            <div class="info-item" hidden="${!info}">
              <book-rating rating="${info && info.averageRating}"></book-rating>
            </div>
          </div>
        </div>
        <div class="desc">
          ${info ? unsafeHTML(info.description || info.subtitle || '<i>No descriptions.</i>') : ''}
        </div>
      </a>
    `;
  }

  static get properties() {
    return {
      item: Object
    };
  }
}

window.customElements.define('book-featured-item', BookFeaturedItem);

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

class BookItem extends LitElement {
  render({ item }) {
    let info = item && item.volumeInfo;
    let thumbnail = info ? info.imageLinks.thumbnail.replace('http', 'https') : '';

    return html`
      <style>
        :host {
          display: block;
        }

        a {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          color: inherit;
          text-decoration: none;
        }

        book-image {
          width: 100%;
          pointer-events: none;
        }

        book-image::before {
          content: "";
          display: block;
          padding-top: 160%;
        }

        .title {
          position: absolute;
          bottom: 4px;
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
          font-weight: bold;
          letter-spacing: 0.1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>

      <a href="/detail/${item ? item.id : ''}">
        <book-image src="${thumbnail}"></book-image>
        <div class="title">${info ? info.title : ''}</div>
      </a>
    `;
  }

  static get properties() {
    return {
      item: Object
    };
  }
}

window.customElements.define('book-item', BookItem);

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
store.addReducers({
  books
});

class BookExplore extends connect(store)(LitElement) {
  render({ active, query, items, showOffline }) {
    // Don't render if the page is not active.
    if (!active) {
      return;
    }

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
          ${repeat(otherItems, item => html`
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

  static get properties() {
    return {
      active: Boolean,
      query: String,
      items: Array,
      showOffline: Boolean
    };
  }

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

var bookExplore = {
  searchBooks: searchBooks
};

export { bookExplore as $bookExplore };