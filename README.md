![built_with pwa–starter–kit_](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)

# Books PWA

Books is a simple Google Books PWA. It uses [Google Books API](https://developers.google.com/books/docs/v1/reference/volumes/list) to search for books and [Embedded Viewer API](https://developers.google.com/books/docs/viewer/reference) to display book content.

Additionally it uses [OAuth 2.0](https://developers.google.com/identity/protocols/OAuth2UserAgent) authorization to retrieve a listing of the Favorites on the authenticated user's bookshelf. As well as add/remove favorite on the authenticated user's bookshelf.

The app is built using [PWA Starter Kit](https://github.com/PolymerLabs/pwa-starter-kit). Using the starter-template as the starting point and the [wiki](https://github.com/PolymerLabs/pwa-starter-kit/wiki) for configuring and personalizing.

![books screenshot](https://user-images.githubusercontent.com/116360/37804470-9fe1d1bc-2df1-11e8-9751-c073da685b40.jpg)

## Features/highlights

- Show a basic search-list-detail flow.
- Use `fetch` to send request to Google Books API.
- Sign-in to Google account using [Google Sign-In Client API](https://developers.google.com/identity/sign-in/web/reference#googleauthsignin)
- OAuth 2.0 authorization to access Google APIs via [Google API Client Library](https://developers.google.com/api-client-library/javascript/reference/referencedocs)
- Display offline UI when fetch returns failure while offline.
- And once it comes back online, automatically re-fetch and update the page.
- Shimmer placeholder while content is loading.  
    ![shimmer](https://user-images.githubusercontent.com/116360/38531318-1ec79c38-3c24-11e8-8e8f-d2efdf190afa.gif)
- Update the browser URL programmatically without causing page reload. In the app, we want to append query param to the URL when the search input’s value is committed.
- Scroll to top on page change.
- `<book-rating>`: Simple rating element.
- `<book-image>`: Basic image element which fades in when the image is loaded. Also has a placeholder that can be used to put a base64 encoded data URL to create the “blur up” effect.
- `<book-input-decorator>`: Simple input decorator element in which the input's underline animates when the input is focused.

## Setup
```bash
$ npm i
$ polymer serve # or similar that serve index.html for all routes
```

#### Enable OAuth for list/add/remove favorites on the authenticated user's bookshelf
- Enable Books API and create OAuth client ID  
https://developers.google.com/identity/protocols/OAuth2UserAgent#prerequisites
- Set the OAuth client ID in the application [here](https://github.com/PolymerLabs/books/blob/master/src/actions/auth.js#L24)

## Build and deploy
```bash
$ git checkout deploy # checkout the deploy branch
$ npm install
$ npm run build
```
Download the [Google App Engine SDK](https://cloud.google.com/appengine/downloads) and follow the instructions to install and create a new project. This app uses the Python SDK.
```bash
$ gcloud app deploy --project <project>
```
