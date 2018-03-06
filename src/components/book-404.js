/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '../../node_modules/@polymer/lit-element/lit-element.js'
import { updateMetadata } from '../../node_modules/pwa-helpers/metadata.js';

class Book404 extends LitElement {
  render({active}) {
    // Don't render if the page is not active.
    if (!active) {
      return;
    }

    updateMetadata({
      title: `Page Not Found - Books`,
      description: 'Page not found',
      url: document.location.href
    });

    return html`
      <style>
        :host {
          padding: 16px;
          text-align: center;
          line-height: 1.5;
        }
      </style>

      <section>
        <h2>Oops! You hit a 404</h2>
        <p>The page you're looking for doesn't seem to exist. Head back
           <a href="/">home</a> and try again?
        </p>
      </section>
    `;
  }

  static get properties() { return {
    active: Boolean
  }}
}

window.customElements.define('book-404', Book404);
