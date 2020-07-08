import React, { createContext, useReducer, useEffect } from 'react';
import T from 'prop-types';

import queryDataReducer, { fetchQueryData } from '../context/explore-data';
import { wrapApiResult } from '../context/reduxeed';

const ExploreContext = createContext({});

const reduceResponse = (state, action) => {
  return wrapApiResult(queryDataReducer(state, action));
};

const initialState = wrapApiResult({
  fetching: false,
  fetched: false,
  error: null,
  data: {}
});

export function ExploreProvider (props) {
  const [countries, dispatchCountries] = useReducer(reduceResponse, initialState);
  const [resources, dispatchResources] = useReducer(reduceResponse, initialState);
  const [queryParams, dispatchQueryParams] = useReducer(reduceResponse, initialState);

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
