import React, { createContext, useReducer, useEffect } from 'react';
import T from 'prop-types';

import queryDataReducer, { fetchQueryData } from '../context/explore-data';
import { initialApiRequestState } from '../context/contexeed';

const ExploreContext = createContext({});

export function ExploreProvider (props) {
  const [countries, dispatchCountries] = useReducer(queryDataReducer, initialApiRequestState);
  const [resources, dispatchResources] = useReducer(queryDataReducer, initialApiRequestState);
  const [queryParams, dispatchQueryParams] = useReducer(queryDataReducer, initialApiRequestState);

  const getQueryData = () => {
    fetchQueryData('country')(dispatchCountries);
    fetchQueryData('resource')(dispatchResources);
    fetchQueryData('query')(dispatchQueryParams);
  };

  useEffect(getQueryData, []);

  return (
    <>
      <ExploreContext.Provider
        value={{
          countries,
          resources,
          queryParams
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
