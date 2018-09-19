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

class SpeechMic extends LitElement {
  render() {
    return html`
      <style>
        :host {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          align-content: stretch;
          position: relative;
          width: 40px;
          height: 40px;
        }

        button {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
          padding: 8px;
          box-sizing: border-box;
          background: transparent;
          border-radius: 50%;
          outline: none;
        }

        button:focus {
          background-color: #dedede;
        }

        :host([recognizing]) > button {
          background-color: #d23f31;
          fill: #fff;
          box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

        .ring1 {
          display: none;
          position: absolute;
          width: 200%;
          height: 200%;
          border-radius: 100%;
          background-color: rgba(0, 0, 0 , 0.1);
        }

        :host([recognizing]) > .ring1 {
          display: block;
          animation: ring1-pulse 1.2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
        }

        @keyframes ring1-pulse {
          0% {
            transform: scale(0.5);
          }
          40% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1);
          }
        }

        .ring2 {
          display: none;
          position: absolute;
          width: 300%;
          height: 300%;
          border-radius: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        :host([recognizing]) > .ring2 {
          display: block;
          animation: ring2-pulse 1.5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
        }

        @keyframes ring2-pulse {
          0% {
            transform: scale(0.3);
          }
          40% {
            transform: scale(0.5);
          }
          100% {
            transform: scale(1);
          }
        }
      </style>

      <div class="ring1"></div>
      <div class="ring2"></div>
      <button title="Search by voice" @click="${() => this.toggle()}">
        <svg viewBox="0 0 24 24">
          <g><path d="M12,14c1.7,0,3-1.3,3-3l0-6c0-1.7-1.3-3-3-3c-1.7,0-3,1.3-3,3v6C9,12.7,10.3,14,12,14z M17.3,11c0,3-2.5,5.1-5.3,5.1c-2.8,0-5.3-2.1-5.3-5.1H5c0,3.4,2.7,6.2,6,6.7V21h2v-3.3c3.3-0.5,6-3.3,6-6.7H17.3z"></path></g>
        </svg>
      </button>
    `;
  }

  static get properties() { return {
    transcript: { type: String },
    completeTranscript: { type: String },
    language: { type: String },
    continuous: { type: Boolean },
    interimResults: { type: Boolean },
    _recognizing: { type: Boolean, attribute: 'recognizing', reflect: true }
  }}

  constructor() {
    super();
    this.language = window.navigator.language;
  }

  firstUpdated() {
    if (window.webkitSpeechRecognition) {
      this._recognition = new webkitSpeechRecognition();
      this._recognition.continuous = this.continuous;
      this._recognition.interimResults = this.interimResults;
      this._recognition.lang = this.language;
      this._recognition.onstart = this._onStart.bind(this);
      this._recognition.onend = this._onEnd.bind(this);
      this._recognition.onresult = this._onResult.bind(this);
      this._recognition.onerror = this._onError.bind(this);
    } else {
      this.style.display = 'none';
    }
  }

  toggle() {
    if (!this._recognition) {
      return;
    }
    if (this._recognizing) {
      this._recognition.stop();
    } else {
      this._recognition.start();
    }
  }

  stop() {
    this._recognition && this._recognition.stop();
  }

  _onStart() {
    this._recognizing = true;
  }

  _onEnd() {
    this._recognizing = false;
  }

  _onResult(e) {
    let t, ct = '', isFinal;
    for (let i = 0, r; r = e.results[i]; i++) {
      t = r[0] && r[0].transcript || '';
      ct += t;
      isFinal = r.isFinal;
    }
    this.transcript = t;
    this.completeTranscript = ct;
    this.dispatchEvent(new CustomEvent('result', {detail: {
      results: e.results,
      transcript: t,
      completeTranscript: ct,
      isFinal: isFinal
    }}));
    if (isFinal) {
      this.stop();
    }
  }

  _onError(e) {
    console.log(e);
  }
}

window.customElements.define('speech-mic', SpeechMic);
