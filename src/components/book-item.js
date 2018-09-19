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
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import './book-image.js';
import './book-rating.js';

class BookItem extends LitElement {
  render() {
    const { item } = this;
    const info = item && item.volumeInfo;
    const id = item ? item.id : '';
    const title = info ? info.title : '';
    const author = info ? info.authors && info.authors.join(', ') : '';
    const thumbnail = info ? info.imageLinks.thumbnail.replace('http', 'https').replace('&edge=curl', '') : null;
    const date = info ? new Date(info.publishedDate).getFullYear() : '';
    const rating = info && info.averageRating;
    const desc = info ? unsafeHTML(info.description || info.subtitle || '<i>No descriptions.</i>') : '';

    return html`
      <style>
        :host {
          display: block;
        }

        a,
        .placeholder {
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
          width: 96px;
          pointer-events: none;
        }

        book-image::before {
          content: "";
          display: block;
          padding-top: 160%;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 8px 8px 8px 16px;
          font-size: 14px;
          font-weight: 300;
          overflow: hidden;
        }

        .title-container {
          display: flex;
        }

        .title {
          position: relative;
          flex: 1;
          margin: 0 6px 0 0;
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

        .placeholder {
          animation: shimmer 1s infinite linear forwards;
          background: #f6f7f8;
          background: linear-gradient(to right, #eee 8%, #ddd 18%, #eee 33%);
          background-size: 800px 104px;
        }

        .placeholder[fadeout] {
          animation-iteration-count: 2;
          transition: 0.5s opacity;
          opacity: 0;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0
          }
          100% {
            background-position: 468px 0
          }
        }

        .placeholder-info {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% - 96px);
          height: 154px;
          box-sizing: border-box;
          border-top: 8px solid #fff;
          border-right: 30px solid #fff;
          border-bottom: 66px solid #fff;
          border-left: 16px solid #fff;
        }

        .placeholder-info-inner-1 {
          height: 12px;
          margin-top: 24px;
          background: #fff;
        }

        .placeholder-info-inner-2 {
          height: 12px;
          margin-top: 16px;
          background: #fff;
        }

        .placeholder-desc {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: calc(100% - 154px);
          box-sizing: border-box;
          border-top: 8px solid #fff;
          border-right: 30px solid #fff;
          border-bottom: 8px solid #fff;
          border-left: 12px solid #fff;
        }

        /* Wide layout */
        @media (min-width: 648px) {
          .info {
            flex-direction: row;
          }

          .info-section {
            padding: 16px;
          }

          .desc {
            margin: 8px 16px;
          }

          book-image {
            width: 128px;
          }

          .title {
            font-size: 20px;
          }

          .info-item {
            padding-top: 12px;
          }

          .placeholder-info {
            top: 0;
            right: 0;
            bottom: calc(100% - 205px);
            left: auto;
            width: calc(100% - 128px);
            height: auto;
            border-top: 16px solid #fff;
            border-right: 30px solid #fff;
            border-bottom: 104px solid #fff;
            border-left: 16px solid #fff;
          }

          .placeholder-info-inner-1 {
            height: 12px;
            margin-top: 30px;
            background: #fff;
          }

          .placeholder-info-inner-2 {
            height: 12px;
            margin-top: 16px;
            background: #fff;
          }

          .placeholder-desc {
            height: calc(100% - 205px);
            border-top: 16px solid #fff;
            border-right: 30px solid #fff;
            border-bottom: 30px solid #fff;
            border-left: 16px solid #fff;
          }
        }
      </style>

      <a href="/detail/${id}">
        <div class="info">
          <book-image .src="${thumbnail}" .alt="${title}"></book-image>
          <div class="info-section">
            <div class="title-container">
              <h2 class="title">${title}</h2><slot></slot>
            </div>
            <div class="author info-item" ?hidden="${!author}">${author} - ${date}</div>
            <div class="info-item" ?hidden="${!info}">
              <book-rating .rating="${rating}"></book-rating>
            </div>
          </div>
        </div>
        <div class="desc">${desc}</div>
      </a>

      <div class="placeholder" ?fadeout="${info}">
        <div class="placeholder-info">
          <div class="placeholder-info-inner-1"></div>
          <div class="placeholder-info-inner-2"></div>
        </div>
        <div class="placeholder-desc"></div>
      </div>
    `;
  }

  static get properties() { return {
    item: { type: Object }
  }}
}

window.customElements.define('book-item', BookItem);
