import React, { createContext, useEffect, useState } from 'react';
import T from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import QsState from '../utils/qs-state';

import config from '../config';

import countries from '../../data/countries.json';
import regions from '../../data/regions.json';

import fetchZones from './fetch-zones';

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

  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('site-tour', tourStep);
  }, [tourStep]);

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

  const generateZones = async (filterString) => {
    showGlobalLoading();
    const zones = await fetchZones(selectedAreaId, filterString);
    setCurrentZones(zones);
    setInputTouched(false);
    !zonesGenerated && setZonesGenerated(true);
    hideGlobalLoading();
  };

  const [currentZones, setCurrentZones] = useState(null);

  const [filteredLayerUrl, setFilteredLayerUrl] = useState(null);

  function updateFilteredLayer (filterValues) {
    const filterString = filterValues.map(({ min, max }) => `${min},${max}`).join('|');
    setFilteredLayerUrl(
      `${config.apiEndpoint}/filter/{z}/{x}/{y}.png?filters=${filterString}&color=45,39,88,178`
    );
    generateZones(filterString);
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
          updateFilteredLayer,
          tourStep,
          setTourStep
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
