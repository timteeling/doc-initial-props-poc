import React, { createContext } from 'react';
import PropTypes from 'prop-types';

/* First we will make a new context */
const AppContext = createContext();

/* Then create a provider Component */
const AppProvider = (props) => {
  const { children, value } = props;
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/* then make a consumer which will surface it */
const AppConsumer = AppContext.Consumer;

AppProvider.propTypes = {
  value: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node.isRequired,
};

AppProvider.defaultProps = {
  value: {},
};

export default AppProvider;
export { AppConsumer, AppContext };
