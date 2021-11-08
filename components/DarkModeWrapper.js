import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { get, hasIn } from 'lodash';
import Cookie from 'js-cookie';
import { DarkModeContextProvider } from './DarkModeContext';

const DarkModeWrapper = ({ cookies, children }) => {
  const darkMode = JSON.parse(get(cookies, 'darkMode', false));
  const [darkModeActive, setDarkModeActive] = useState(darkMode);
  const [autoModeActive, setAutoModeActive] = useState(false);
  const [systemDarkMode, setSystemDarkMode] = useState(false);

  const setTheme = useCallback((mode) => {
    Cookie.set('darkMode', mode, { expires: 30, sameSite: 'lax' });
    setDarkModeActive(mode);

    if (mode) document.body.classList.add('dark-mode');
    if (!mode) document.body.classList.remove('dark-mode');
  }, []);

  const setDarkMode = () => {
    setAutoModeActive(false);
    setTheme(true);
  };

  const setLightMode = () => {
    setAutoModeActive(false);
    setTheme(false);
  };

  const toggleDarkMode = (mode = (!darkModeActive)) => {
    setAutoModeActive(false);
    setTheme(mode);
  };

  const setAutoMode = useCallback((mode = systemDarkMode) => {
    setAutoModeActive(true);
    setTheme(mode);
    Cookie.remove('darkMode');
  }, [setAutoModeActive, setTheme, systemDarkMode]);

  const systemTheme = useCallback(() => {
    const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDarkMode(matches);

    if (!hasIn(cookies, 'darkMode') && matches) setAutoMode(matches);
  }, [cookies, setAutoMode]);

  useEffect(() => {
    systemTheme();
  }, [systemTheme]);

  return (
    <DarkModeContextProvider value={{
      darkModeActive,
      autoModeActive,
      toggleDarkMode: () => toggleDarkMode(!darkModeActive),
      setDarkMode: () => setDarkMode(),
      setLightMode: () => setLightMode(),
      setAutoMode: () => setAutoMode(),
    }}
    >
      { children }
    </DarkModeContextProvider>
  );
};

DarkModeWrapper.propTypes = {
  children: PropTypes.node,
  cookies: PropTypes.objectOf(PropTypes.any),
};

DarkModeWrapper.defaultProps = {
  children: null,
  cookies: {},
};

export default DarkModeWrapper;
