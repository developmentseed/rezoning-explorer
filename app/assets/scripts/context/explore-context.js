import React, { createContext, useEffect, useState } from 'react';
import T from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import * as topojson from 'topojson-client';
import bbox from '@turf/bbox';
import QsState from '../utils/qs-state';

import config from '../config';

import countries from '../../data/countries.json';
import regions from '../../data/regions.json';

import fetchZones from './fetch-zones';

import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/common/global-loading';

const energyAreaTypeMap = {
  'Off-Shore Wind': ['eez'],
  'Solar PV': ['country', 'region'],
  Wind: ['country', 'region'],
  default: ['country', 'region']
};
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
  const [areas, setAreas] = useState([]);

  const [selectedArea, setSelectedArea] = useState(areas.find((a) => a.id === selectedAreaId));

  const [selectedResource, setSelectedResource] = useState(qsState.resourceId);
  const [showSelectResourceModal, setShowSelectResourceModal] = useState(
    !qsState.resourceId
  );
  const [areaTypeFilter, setAreaTypeFilter] = useState(energyAreaTypeMap[selectedResource] || energyAreaTypeMap.default);

  const [hoveredFeatures, setHoveredFeatures] = useState([]);

  const [tourStep, setTourStep] = useState(0);

  const loadAreas = async () => {
    showGlobalLoading();
    // Parse region and country files into area list

    const eez = await fetch('public/zones/eez_v11.topojson').then(e => e.json());
    const { features: eezFeatures } = topojson.feature(
      eez,
      eez.objects.eez_v11
    );

    const areas = regions
      .map((r) => ({
        ...r,
        type: 'region',
        bounds: r.bounds ? r.bounds.split(',').map((x) => parseFloat(x)) : null
      })) // add area type
      .concat(
        countries.map((c) => ({
          ...c,
          id: c.gid, // set id from GADM GID
          type: 'country', // add area type
          alpha2: c.alpha2, // set id from alpha-2
          bounds: c.bounds ? c.bounds.split(',').map((x) => parseFloat(x)) : null
        }))

        // add in the eez
      )
      .concat(
        eezFeatures.map(z => ({
          feature: z,
          id: z.properties.MRGID,
          name: `${z.properties.MRGID}`,
          type: 'eez',
          bounds: bbox(z)
        }))
      );
    setAreas(areas);
    hideGlobalLoading();
  };

  useEffect(() => {
    setSelectedArea(areas.find((a) => `${a.id}` === `${selectedAreaId}`));
  }, [areas, selectedAreaId]);

  useEffect(() => {
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }

    loadAreas();
  }, []);

  useEffect(() => {
    localStorage.setItem('site-tour', tourStep);
  }, [tourStep]);

  useEffect(() => {
    let overrideId;

    const nextFilter = energyAreaTypeMap[selectedResource];

    if (nextFilter) {
      setAreaTypeFilter(nextFilter);

      if (selectedArea && !nextFilter.includes(selectedArea.type)) {
        overrideId = null;
      }
    }

    const qString = qsStateHelper.getQs({
      areaId: overrideId === undefined ? selectedAreaId : overrideId,
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
  const [currentZones, setCurrentZones] = useState(null);

  const generateZones = async (filterString, weights, lcoe) => {
    showGlobalLoading();
    const zones = await fetchZones(selectedArea, filterString, weights, lcoe);
    setCurrentZones(zones);
    setInputTouched(false);
    !zonesGenerated && setZonesGenerated(true);
    hideGlobalLoading();
  };

  const [filteredLayerUrl, setFilteredLayerUrl] = useState(null);

  function updateFilteredLayer (filterValues, weights, lcoe) {
    const filterString = filterValues
      .map(({ min, max }) => `${min},${max}`)
      .join('|');
    setFilteredLayerUrl(
      `${config.apiEndpoint}/filter/{z}/{x}/{y}.png?filters=${filterString}&color=54,166,244,80`
    );
    generateZones(filterString, weights, lcoe);
  }

  return (
    <>
      <ExploreContext.Provider
        value={{
          areas,
          areaTypeFilter,
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
          hoveredFeatures,
          setHoveredFeatures,
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
