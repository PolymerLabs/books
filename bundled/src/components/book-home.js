import { LitElement, html } from './book-app.js';


/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

class BookHome extends LitElement {
  render(props) {
    return html`
      <style>
        :host {
          display: block;
        }

        .books-bg {
          height: 300px;
          max-width: 600px;
          margin: 0 auto;
        }
      </style>

      <book-image class="books-bg" center src="images/books-bg.jpg" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAAI0lEQVR4AWPw2v7Wfe1Dj7X3/Pd8YPDf+Uqva79x38GQvW8Bu0sOexptskUAAAAASUVORK5CYII="></book-image>
    `;
  }
}

window.customElements.define('book-home', BookHome);