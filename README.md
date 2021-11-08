# Custom Document `getInitialProps` usage

`npm run dev`

This example is based on the `custom-server-koa` example and has bits added in to try & illustrate our usage but lacks any CSS or fonts.

We use Next's custom document's `getInitialProps` for the following scenarios:

1. Read a cookie & set a class on the HTML element to determine if fonts loaded via FontFaceObserver have loaded so we can have it cached for repeat visits & to prevent FOUT. See `useLoadFonts.js`
2. Read a cookie & sset a body class for dark mode preference. We have logic to automatically set the theme in `DarkModeWrapper`, we also allow user to override it so this allows for saving the preference & preventing FOUC.
3. Pass a `nonce` from our custom server to Next for usage in a Content Security Policy.


### Example CSS that would leverage these classes

```css
/* Font loading */
body {
  font-family: system-ui, sans-serif;
  background: #fff;
  color: #041e42;
}

.fonts-loaded body {
  font-family: barlow, system-ui, sans-serif;
}

/* Dark mode preferences */
.dark-mode {
  background: #041e42;
  color: #fff;
}
```
