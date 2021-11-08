import NextApp from 'next/app';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import nextCookies from 'next-cookies';
import get from 'lodash/get';
import DarkModeWrapper from '../components/DarkModeWrapper';
import AppWrapper from '../components/AppWrapper';
import useLoadFonts from '../components/useLoadFonts';

const App = ({
  Component, pageProps, cookies, user: initialUser, csrf: initialCsrf,
}) => {
  const [user] = useState(initialUser);
  const [csrf] = useState(initialCsrf);
  useLoadFonts({ cookies });

  return (
    <DarkModeWrapper cookies={cookies}>
      <AppWrapper
        appContext={{
          user,
          csrf,
        }}
      >
        <Component
          {...pageProps}
          cookies={cookies}
        />
      </AppWrapper>
    </DarkModeWrapper>
  );
};

App.getInitialProps = async (appContext) => {
  let appProps = {};
  const { ctx } = appContext;
  const cookies = nextCookies(ctx);
  const user = get(ctx, 'req.session.user', null);
  const csrf = get(ctx, 'req.csrf', null);

  if (appContext) {
    appProps = await NextApp.getInitialProps(appContext);
  }

  return { ...appProps, ...{ cookies, user, csrf } };
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any),
  cookies: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
  csrf: PropTypes.string,
};

App.defaultProps = {
  pageProps: {},
  cookies: {},
  user: null,
  csrf: null,
};

export default App;
