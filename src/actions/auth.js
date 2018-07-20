/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import firebase from 'firebase/app'
import 'firebase/auth';
// See https://firebase.google.com/docs/web/setup?authuser=0
import { config } from './config.js'

export const SET_USER = 'SET_USER';
export const AUTH_INITIALIZED = 'AUTH_INITIALIZED';

// Initialize Firebase
firebase.initializeApp(config);

export const initFirebaseApp = () => (dispatch) => {
  if (firebase.apps.length) {
    dispatch(authInitialized());
  }
  firebase.auth().onAuthStateChanged(function (user) {
    dispatch(setUser(user));
  });
}

export const signIn = () => async (dispatch) => {
  if (!firebase.auth().currentUser) {
    const provider = new firebase.auth.GoogleAuthProvider();
    // Add rights:
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
      } else {
        console.error(error.message);
      }
    }
  }
};

export const signOut = () => (dispatch) => {
  firebase.auth().signOut();
}

const authInitialized = () => {
  return {
    type: AUTH_INITIALIZED
  }
}

const setUser = (user) => {
  return {
    type: SET_USER,
    user
  };
}
