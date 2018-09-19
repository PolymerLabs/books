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

import { BookButtonStyle } from './shared-styles.js';

class BookOffline extends LitElement {
  render() {
    return html`
      ${BookButtonStyle}
      <style>
        :host {
          padding: 16px;
          text-align: center;
          line-height: 1.5;
        }
      </style>

      <section>
        <h3>Oops! You are offline and the request resource is unavailable.</h3>
        <button class="book-button" @click="${() => this._refresh()}">Try Again...</button>
      </section>
    `;
  }

  _refresh() {
    this.dispatchEvent(new CustomEvent('refresh', {composed: true}));
  }
}

window.customElements.define('book-offline', BookOffline);
