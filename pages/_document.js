import React from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document';
import cookie from 'cookie-parse';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage, req }) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const fontsLoaded = JSON.parse(cookies.fontsLoaded || false);
    const darkMode = JSON.parse(cookies.darkMode || false);
    const { nonce } = req;

    const {
      html,
      head,
      errorHtml,
      chunks,
    } = renderPage();
    return {
      html,
      head,
      errorHtml,
      chunks,
      fontsLoaded,
      nonce,
      darkMode,
    };
  }

  render() {
    const { fontsLoaded, nonce, darkMode } = this.props;
    return (
      <Html lang="en" className={fontsLoaded ? 'fonts-loaded' : undefined}>
        <Head nonce={nonce} />
        <body
          className={darkMode ? 'dark-mode' : undefined}
        >
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}
