import React, { createContext, useReducer, useEffect, useState } from 'react';
import T from 'prop-types';

import queryDataReducer, { fetchQueryData } from '../context/explore-data';
import { initialApiRequestState } from '../context/contexeed';
import { showGlobalLoading, hideGlobalLoading } from '../components/common/global-loading';

const ExploreContext = createContext({});

export function ExploreProvider (props) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const [countries, dispatchCountries] = useReducer(
    queryDataReducer,
    initialApiRequestState
  );

  const getQueryData = async () => {
    showGlobalLoading();
    await fetchQueryData('countries')(dispatchCountries);
    hideGlobalLoading();
  };

  const onMount = () => {
    getQueryData();
  };

  useEffect(onMount, []);

  return (
    <>
      <ExploreContext.Provider
        value={{
          countries,
          selectedCountry,
          setSelectedCountry,
          selectedResource,
          setSelectedResource
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
