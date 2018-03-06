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
import './book-image.js';

class BookItem extends LitElement {
  render({item}) {
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

  static get properties() { return {
    item: Object
  }}
}

window.customElements.define('book-item', BookItem);
