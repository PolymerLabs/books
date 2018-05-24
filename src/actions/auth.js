/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const SET_USER = 'SET_USER';
export const AUTH_INITIALIZED = 'AUTH_INITIALIZED';

let GoogleAuth;

export const initAuth = (dispatch) => {
  if (GoogleAuth) {
    return Promise.resolve(GoogleAuth);
  }
  return loadGapi().then(() => {
    return gapi.client.init({
      // Put your client ID here. See https://developers.google.com/identity/protocols/OAuth2UserAgent
      // for how to create one.
      clientId: '',
      scope: 'https://www.googleapis.com/auth/books'
    }).then(() => {
      GoogleAuth = gapi.auth2.getAuthInstance();
      dispatch(authInitialized());
      return Promise.resolve(GoogleAuth);
    });
  });
}

export const fetchUser = () => (dispatch) => {
  initAuth(dispatch).then(() => {
    if (GoogleAuth.isSignedIn.get()) {
      dispatch(setUser(getUserFromGoogleUser(GoogleAuth.currentUser.get())));
    }
  });
}

export const signIn = () => (dispatch) => {
  initAuth(dispatch).then(() => {
    GoogleAuth.signIn({ prompt: 'select_account' })
      .then((googleUser) => {
        dispatch(setUser(getUserFromGoogleUser(googleUser)));
      });
  });
};

export const signOut = () => (dispatch) => {
  initAuth(dispatch).then(() => {
    GoogleAuth.signOut()
      .then(() => {
        dispatch(setUser());
      });
  });
}

const getUserFromGoogleUser = (googleUser) => {
  const profile = googleUser.getBasicProfile();
  return {
    id: profile.getId(),
    fullName: profile.getName(),
    email: profile.getEmail(),
    imageUrl: profile.getImageUrl()
  };
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

let initCalled;
const callbackPromise = new Promise((r) => window.__gapiCallback = r);

const loadGapi = () => {
  if (!initCalled) {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api:client.js?onload=__gapiCallback';
    script.setAttribute('async', '');
    document.head.appendChild(script);
    initCalled = true;
  }
  return callbackPromise;
}
