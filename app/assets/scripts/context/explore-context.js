import React, { createContext, useEffect, useState, useReducer } from 'react';
import T from 'prop-types';
import * as topojson from 'topojson-client';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

import { featureCollection } from '@turf/helpers';
import useQsState from '../utils/qs-state-hook';

import config from '../config';

import areasJson from '../../data/areas.json';

import { fetchZonesReducer, fetchZones } from './fetch-zones';

import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/common/global-loading';
import { INPUT_CONSTANTS } from '../components/explore/panel-data';

import { initialApiRequestState } from './contexeed';
const { GRID_OPTIONS } = INPUT_CONSTANTS;

const ExploreContext = createContext({});

export function ExploreProvider (props) {
  const [selectedArea, setSelectedArea] = useState(null);

  const [selectedAreaId, setSelectedAreaId] = useQsState({
    key: 'areaId',
    default: undefined
  });

  const [showSelectAreaModal, setShowSelectAreaModal] = useState(
    !selectedAreaId
  );

  const [areas, setAreas] = useState([]);

  const [map, setMap] = useState(null);

  useEffect(() => {
    setSelectedArea(areas.find((a) => a.id === selectedAreaId));
  }, [selectedAreaId]);

  const [selectedResource, setSelectedResource] = useQsState({
    key: 'resourceId',
    default: undefined
  });

  const [showSelectResourceModal, setShowSelectResourceModal] = useState(
    !selectedResource
  );

  useEffect(() => {
    setShowSelectAreaModal(!selectedAreaId);
    setShowSelectResourceModal(!selectedResource);
  }, [selectedAreaId, selectedResource]);

  const [gridMode, setGridMode] = useState(false);
  const [gridSize, setGridSize] = useState(GRID_OPTIONS[0]);

  const [tourStep, setTourStep] = useState(0);

  const loadAreas = async () => {
    showGlobalLoading();
    // Parse region and country files into area list

    const eez = await fetch('public/zones/eez_v11.topojson').then((e) =>
      e.json()
    );
    const { features: eezFeatures } = topojson.feature(
      eez,
      eez.objects.eez_v11
    );
    const eezCountries = eezFeatures.reduce((accum, z) => {
      const id = z.properties.ISO_TER1;
      accum.set(id, [...(accum.has(id) ? accum.get(id) : []), z]);
      return accum;
    }, new Map());

    setAreas(
      areasJson.map((a) => {
        if (a.type === 'country') {
          a.id = a.gid;
          a.eez = eezCountries.get(a.id);
        }
        a.bounds = a.bounds
          ? a.bounds.split(',').map((x) => parseFloat(x))
          : null;
        return a;
      })
    );
    hideGlobalLoading();
  };

  useEffect(() => {
    setSelectedArea(areas.find((a) => a.id === selectedAreaId));
  }, [selectedAreaId]);

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
    dispatchCurrentZones({ type: 'INVALIDATE_FETCH_ZONES' });
  }, [selectedAreaId]);

  const [inputTouched, setInputTouched] = useState(true);
  const [zonesGenerated, setZonesGenerated] = useState(false);

  const [currentZones, dispatchCurrentZones] = useReducer(
    fetchZonesReducer,
    initialApiRequestState
  );

  const generateZones = async (filterString, weights, lcoe) => {
    showGlobalLoading();
    fetchZones(
      gridMode && gridSize,
      selectedArea,
      filterString,
      weights,
      lcoe,
      dispatchCurrentZones
    );
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
