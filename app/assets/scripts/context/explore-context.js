import React, { createContext, useEffect, useState, useReducer } from 'react';
import T from 'prop-types';
import { useHistory, useLocation } from 'react-router';
import * as topojson from 'topojson-client';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

import { featureCollection } from '@turf/helpers';
import QsState from '../utils/qs-state';

import config from '../config';

import countries from '../../data/countries.json';
import regions from '../../data/regions.json';

import { fetchZonesReducer, fetchZones } from './fetch-zones';

import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/common/global-loading';
import { INPUT_CONSTANTS } from '../components/explore/panel-data';

import { initialApiRequestState } from './contexeed';
const { GRID_OPTIONS } = INPUT_CONSTANTS;

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
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState(qsState.areaId);
  const [showSelectAreaModal, setShowSelectAreaModal] = useState(
    !qsState.areaId
  );
  const [areas, setAreas] = useState([]);

  const [map, setMap] = useState(null);
  useEffect(() => {
    setSelectedArea(areas.find((a) => a.id === selectedAreaId));
  }, [selectedAreaId]);

  const [selectedResource, setSelectedResource] = useState(qsState.resourceId);
  const [showSelectResourceModal, setShowSelectResourceModal] = useState(
    !qsState.resourceId
  );
  // const [areaTypeFilter, setAreaTypeFilter] = useState(energyAreaTypeMap[selectedResource] || energyAreaTypeMap.default);

  const [gridMode, setGridMode] = useState(false);
  const [gridSize, setGridSize] = useState(GRID_OPTIONS[0]);

  const [tourStep, setTourStep] = useState(0);

  const loadAreas = async () => {
    showGlobalLoading();
    // Parse region and country files into area list

    const eez = await fetch('public/zones/eez_v11.topojson').then(e => e.json());
    const { features: eezFeatures } = topojson.feature(
      eez,
      eez.objects.eez_v11
    );
    const eezCountries = eezFeatures.reduce((accum, z) => {
      const id = z.properties.ISO_TER1;
      accum.set(id,
        [...(accum.has(id) ? accum.get(id) : []), z]
      );
      return accum;
    }, new Map());

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
          bounds: c.bounds ? c.bounds.split(',').map((x) => parseFloat(x)) : null,
          eez: eezCountries.get(c.gid)
        }))
      );
    setAreas(areas);
    hideGlobalLoading();
  };

  useEffect(() => {
    let nextArea = areas.find((a) => `${a.id}` === `${selectedAreaId}`);

    if (selectedResource === 'Off-Shore Wind' && nextArea) {
      const initBounds = bboxPolygon(nextArea.bounds);
      const eezs = nextArea.eez ? nextArea.eez : [];
      const fc = featureCollection([initBounds, ...eezs]);
      const newBounds = bbox(fc);
      nextArea = {
        ...nextArea,
        bounds: newBounds
      };
      setGridMode(true);
    }

    setSelectedArea(nextArea);
  }, [areas, selectedAreaId, selectedResource]);

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

    /*
    const nextFilter = energyAreaTypeMap[selectedResource];

    if (nextFilter) {
      setAreaTypeFilter(nextFilter);

      if (selectedArea && !nextFilter.includes(selectedArea.type)) {
        overrideId = null;
      }
    }
      */

    const qString = qsStateHelper.getQs({
      areaId: overrideId === undefined ? selectedAreaId : overrideId,
      resourceId: selectedResource
    });

    // Push params as new URL, if different from current URL
    if (qString !== location.search.substr(1)) {
      history.push({ search: qString });
    }
  }, [selectedAreaId, selectedResource]);

  useEffect(() => {
    dispatchCurrentZones({ type: 'INVALIDATE_FETCH_ZONES' });
  }, [selectedAreaId]);

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

  const [currentZones, dispatchCurrentZones] = useReducer(fetchZonesReducer, initialApiRequestState);

  const generateZones = async (filterString, weights, lcoe) => {
    showGlobalLoading();
    fetchZones(gridMode && gridSize, selectedArea, filterString, weights, lcoe, dispatchCurrentZones);
  };

  useEffect(() => {
    if (currentZones.fetched) {
      hideGlobalLoading();
      !zonesGenerated && setZonesGenerated(true);
      setInputTouched(false);
    }
  }, [currentZones]);

  const [filteredLayerUrl, setFilteredLayerUrl] = useState(null);
  const [lcoeLayerUrl, setLcoeLayerUrl] = useState(null);

  function updateFilteredLayer (filterValues, weights, lcoe) {
    const filterString = filterValues
      .map(({ min, max }) => `${min},${max}`)
      .join('|');
    setFilteredLayerUrl(
      `${config.apiEndpoint}/filter/{z}/{x}/{y}.png?filters=${filterString}&color=54,166,244,80`
    );

    const lcoeReduction = Object.entries(lcoe).reduce((accum, [key, value]) => `${accum}&${key}=${value}`, '');

    setLcoeLayerUrl(
      `${config.apiEndpoint}/lcoe/{z}/{x}/{y}.png?filters=${filterString}&${lcoeReduction}&colormap=cool`
    );
    generateZones(filterString, weights, lcoe);
  }

  return (
    <>
      <ExploreContext.Provider
        value={{
          map,
          setMap,
          areas,
          selectedArea,
          setSelectedAreaId,
          selectedResource,
          setSelectedResource,
          showSelectAreaModal,
          setShowSelectAreaModal,
          showSelectResourceModal,
          setShowSelectResourceModal,
          gridMode,
          setGridMode,
          gridSize,
          setGridSize,
          currentZones,
          generateZones,
          inputTouched,
          setInputTouched,
          zonesGenerated,
          setZonesGenerated,
          filteredLayerUrl,
          updateFilteredLayer,
          lcoeLayerUrl,
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
