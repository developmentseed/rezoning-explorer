import React, { createContext, useReducer, useEffect, useState } from 'react';
import T from 'prop-types';

import queryDataReducer, { fetchQueryData } from '../context/explore-data';
import { initialApiRequestState } from '../context/contexeed';

const ExploreContext = createContext({});

export function ExploreProvider (props) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const [countries, dispatchCountries] = useReducer(
    queryDataReducer,
    initialApiRequestState
  );

  const getQueryData = () => {
    fetchQueryData('countries')(dispatchCountries);
  };

  useEffect(getQueryData, []);

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
