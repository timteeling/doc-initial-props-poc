import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const DarkModeContext = createContext();

const DarkModeContextProvider = ({ children, value }) => (
  <DarkModeContext.Provider value={value}>
    {children}
  </DarkModeContext.Provider>
);

DarkModeContextProvider.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node.isRequired,
};

export { DarkModeContext, DarkModeContextProvider };
