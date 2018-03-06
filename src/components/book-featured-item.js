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
import { unsafeHTML } from '../../node_modules/lit-html/lib/unsafe-html.js';

import { responsiveWidth } from './shared-styles.js';
import './book-image.js';
import './book-rating.js';

class BookFeaturedItem extends LitElement {
  render({item}) {
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

  static get properties() { return {
    item: Object
  }}
}

window.customElements.define('book-featured-item', BookFeaturedItem);
