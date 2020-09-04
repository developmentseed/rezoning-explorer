import React, { createContext, useEffect, useReducer, useState } from 'react';
import T from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import QsState from '../utils/qs-state';

import config from '../config';

import countries from '../../data/countries.json';
import regions from '../../data/regions.json';

import {
  generateZonesReducer,
  fetchGenerateZones
} from '../context/explore-data';
import { initialApiRequestState } from '../context/contexeed';
import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/common/global-loading';

// Parse region and country files into area list
const areas = regions
  .map((r) => ({ ...r, type: 'region' })) // add area type
  .concat(
    countries.map((c) => ({
      ...c,
      id: c.gid, // set id from GADM GID
      type: 'country', // add area type
      alpha2: c.alpha2, // set id from alpha-2
      bounds: c.bounds ? c.bounds.split(',').map((x) => parseFloat(x)) : null
    }))
  );
const ExploreContext = createContext({});

const qsStateHelper = new QsState({
  areaId: {
    accessor: 'areaId'
  },
  resourceId: {
    accessor: 'resourceId'
  }
});

export function ExploreProvider (props) {
  const history = useHistory();
  const location = useLocation();

  const qsState = qsStateHelper.getState(location.search.substr(1));

  const [selectedAreaId, setSelectedAreaId] = useState(qsState.areaId);
  const [showSelectAreaModal, setShowSelectAreaModal] = useState(
    !qsState.areaId
  );
  const selectedArea = areas.find((a) => a.id === selectedAreaId);

  const [selectedResource, setSelectedResource] = useState(qsState.resourceId);
  const [showSelectResourceModal, setShowSelectResourceModal] = useState(
    !qsState.resourceId
  );

  useEffect(() => {
    const qString = qsStateHelper.getQs({
      areaId: selectedAreaId,
      resourceId: selectedResource
    });

    // Push params as new URL, if different from current URL
    if (qString !== location.search.substr(1)) {
      history.push({ search: qString });
    }
  }, [selectedAreaId, selectedResource]);

  // Update context on URL change
  useEffect(() => {
    const { areaId, resourceId } = qsStateHelper.getState(
      location.search.substr(1)
    );

    if (areaId !== selectedAreaId) {
      setSelectedAreaId(areaId);
      setShowSelectAreaModal(!areaId);
    }

    if (resourceId !== selectedResource) {
      setSelectedResource(resourceId);
      setShowSelectResourceModal(!resourceId);
    }
  }, [location.search]);

  const [inputTouched, setInputTouched] = useState(true);
  const [zonesGenerated, setZonesGenerated] = useState(false);

  const generateZones = async () => {
    showGlobalLoading();
    await fetchGenerateZones()(dispatchCurrentZones);
    setInputTouched(false);
    !zonesGenerated && setZonesGenerated(true);
    hideGlobalLoading();
  };

  const [currentZones, dispatchCurrentZones] = useReducer(
    generateZonesReducer,
    initialApiRequestState
  );

  const [filteredLayerUrl, setFilteredLayerUrl] = useState(null);
  function updateFilteredLayer () {
    setFilteredLayerUrl(
      `${config.apiEndpoint}/filter/all/{z}/{x}/{y}.png?filters=100000,1000000|100000,1000000|100000,1000000|100000,1000000|100000,1000000`
    );
  }

  return (
    <>
      <ExploreContext.Provider
        value={{
          areas,
          selectedArea,
          setSelectedAreaId,
          selectedResource,
          setSelectedResource,
          showSelectAreaModal,
          setShowSelectAreaModal,
          showSelectResourceModal,
          setShowSelectResourceModal,
          currentZones,
          generateZones,
          inputTouched,
          setInputTouched,
          zonesGenerated,
          setZonesGenerated,
          filteredLayerUrl,
          updateFilteredLayer
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
