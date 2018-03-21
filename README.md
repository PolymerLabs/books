![built_with pwa–starter–kit_](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)

# Books PWA

Books is a simple Google Books PWA. It uses [Google Books API](https://developers.google.com/books/docs/v1/reference/volumes/list) to search for books and [Embedded Viewer API](https://developers.google.com/books/docs/viewer/reference) to display book content.

The app is built using [PWA Starter Kit](https://github.com/PolymerLabs/pwa-starter-kit). Using the starter-template as the starting point and the [wiki](https://github.com/PolymerLabs/pwa-starter-kit/wiki) for configuring and personalizing.

![books screenshot](https://user-images.githubusercontent.com/116360/37737528-387678d8-2d11-11e8-8079-6a4025e7ed8e.jpg)

## Features/highlights

- Show a basic search-list-detail flow.
- Use `fetch` to send request to Google Books API.
- Display offline UI when fetch returns failure while offline.
- And once it comes back online, automatically re-fetch and update the page.
- Shimmer placeholder while content is loading.  
    ![shimmer](https://user-images.githubusercontent.com/116360/37739056-27dae81a-2d16-11e8-91c5-d4c724d6ced1.gif)
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

## Build and deploy
```bash
$ git checkout deploy # checkout the deploy branch
$ npm run build
$ gcloud app deploy --project <project>
```
