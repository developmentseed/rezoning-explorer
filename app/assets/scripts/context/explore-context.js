import React, { createContext, useReducer, useEffect } from 'react';
import T from 'prop-types';

import queryDataReducer, { fetchQueryData } from '../context/explore-data';
import { initialApiRequestState } from '../context/contexeed';
import { showGlobalLoading, hideGlobalLoading } from '../components/common/global-loading';

const ExploreContext = createContext({});

export function ExploreProvider (props) {
  const [countries, dispatchCountries] = useReducer(queryDataReducer, initialApiRequestState);

  const getQueryData = () => {
    (async () => {
      showGlobalLoading();
      await fetchQueryData('countries')(dispatchCountries);
      hideGlobalLoading();
    })();
  };

  useEffect(getQueryData, []);

  return (
    <>
      <ExploreContext.Provider
        value={{
          countries
        }}
      >
        {props.children}
      </ExploreContext.Provider>
    </>
  );
}

ExploreProvider.propTypes = {
  children: T.node
};

export default ExploreContext;
