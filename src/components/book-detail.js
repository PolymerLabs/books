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
import { repeat } from '../../node_modules/lit-html/lib/repeat.js';
import { unsafeHTML } from '../../node_modules/lit-html/lib/unsafe-html.js';
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

import { refreshPage } from '../actions/app.js';

import { responsiveWidth, BookButtonStyle } from './shared-styles.js';
import './book-rating.js';
import './book-offline.js';

class BookDetail extends connect(store)(LitElement) {
  render({active, item, showOffline}) {
    // Don't render if the page is not active or if there is no item.
    if (!active || !item) {
      return;
    }

    const info = item.volumeInfo;
    const accessInfo = item.accessInfo;
    const author = info.authors && info.authors.join(', ');
    const date = (new Date(info.publishedDate)).getFullYear();
    const pageCount = info.pageCount;
    const ratingsCount = info.ratingsCount;
    const publisher = info.publisher;
    const thumbnail = info.imageLinks.thumbnail.replace('http', 'https');
    const categories = info.categories || [];
    const identifiers = info.industryIdentifiers || [];

    updateMetadata({
      title: `${info.title} - Books`,
      description: info.description,
      url: document.location.href,
      img: thumbnail
    });

    return html`
      <style>${BookButtonStyle}</style>
      <style>
        :host {
          display: block;
          padding: 24px 16px;
        }

        section {
          max-width: 748px;
          box-sizing: border-box;
          font-weight: 300;
        }

        .info {
          display: flex;
          padding-bottom: 16px;
          border-bottom: 1px solid #c5c5c5;
        }

        .cover {
          position: relative;
        }

        .cover::after {
          content: '';
          display: block;
          padding-top: 160%;
          width: 100px;
        }

        .cover > img {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          margin: 0 auto;
        }

        .info-desc {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-left: 16px;
          font-size: 14px;
        }

        .flex {
          flex: 1;
        }

        .title {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.2;
        }

        .info-item {
          padding-top: 8px;
        }

        .desc {
          padding: 8px 0;
          font-size: 15px;
          line-height: 1.8;
        }

        .desc h3 {
          font-size: 15px;
          font-weight: 500;
        }

        .desc ul {
          margin-bottom: 0;
        }

        book-rating {
          margin-right: 6px;
        }

        .rating-container {
          display: flex;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #c5c5c5;
          font-size: 14px;
        }

        .btn-container {
          padding-top: 16px;
        }

        [hidden] {
          display: none !important;
        }

        /* desktop screen */
        @media (min-width: ${responsiveWidth}) {
          :host {
            padding: 48px 24px 24px;
          }

          section {
            margin: 0 auto;
          }

          .info {
            padding-bottom: 24px;
          }

          .cover::after {
            width: 200px;
          }

          .info-desc {
            margin-left: 24px;
          }

          .title {
            margin-bottom: 8px;
            font-size: 24px;
            line-height: 1.3;
          }

          .btn-container {
            display: flex;
            justify-content: flex-end;
            padding-bottom: 24px;
          }

          .rating-container {
            padding: 24px 0;
          }

          .desc {
            padding: 16px 0;
          }
        }
      </style>

      <section hidden="${showOffline}">
        <div class="info">
          <div class="cover" hero>
            <img src="${thumbnail}">
          </div>
          <div class="info-desc">
            <h2 class="title">${info.title}</h2>
            <div class="info-item" hidden="${!author}">${author} - ${date}</div>
            <div class="info-item" hidden="${!pageCount}" desktop>${pageCount} pages</div>
            <div class="info-item" hidden="${!publisher}" desktop>${publisher} - publisher</div>
            <div class="flex"></div>
            <div class="btn-container">
              <a href="/viewer/${item.id}" class="book-button" hidden="${!accessInfo.embeddable}">PREVIEW</a>
            </div>
          </div>
        </div>
        <div class="rating-container">
          <book-rating rating="${info.averageRating}"></book-rating>
          <span>(${ratingsCount || 0} ${ratingsCount == 1 ? 'review' : 'reviews'})</span>
        </div>
        <div class="desc">
          <h3>Description</h3>
          ${unsafeHTML(info.description || info.subtitle || 'None')}
        </div>
        <div class="desc" hidden="${categories.length === 0}">
          <h3>Categories</h3>
          <ul>
            ${repeat(categories, (item) => html`
              <li>${item}</li>
            `)}
          </ul>
        </div>
        <div class="desc" hidden="${identifiers.length === 0}">
          <h3>ISBN</h3>
          <ul>
            ${repeat(identifiers, (item) => html`
              <li>${item.type}: ${item.identifier}</li>
            `)}
          </ul>
        </div>
        <div class="desc">
          <h3>Additional Info</h3>
          <ul>
            <li>Country: ${accessInfo.country}</li>
            <li>Viewability: ${accessInfo.viewability}</li>
          </ul>
        </div>
      </section>

      <book-offline hidden="${!showOffline}" on-refresh="${() => store.dispatch(refreshPage())}"></book-offline>
    `;
  }

  static get properties() { return {
    active: Boolean,
    item: Object,
    showOffline: Boolean
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this.item = bookSelector(state);
    this.showOffline = state.app.offline && state.book.failure;
  }
}

window.customElements.define('book-detail', BookDetail);
