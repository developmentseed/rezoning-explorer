import React, { createContext, useEffect, useState, useReducer } from 'react';
import T from 'prop-types';
import * as topojson from 'topojson-client';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

import { featureCollection } from '@turf/helpers';
import useQsState from '../utils/qs-state-hook';
import config from '../config';
import areasJson from '../../data/areas.json';
import { initialApiRequestState } from './contexeed';
import { fetchZonesReducer, fetchZones } from './reducers/zones';

import {
  showGlobalLoadingMessage,
  hideGlobalLoading
} from '../components/common/global-loading';

import {
  INPUT_CONSTANTS,
  checkIncluded,
  getMultiplierByUnit
} from '../components/explore/panel-data';

const { GRID_OPTIONS, SLIDER, BOOL, DROPDOWN, MULTI, DEFAULT_RANGE } = INPUT_CONSTANTS;
const maskTypes = [BOOL];
const ExploreContext = createContext({});

export function ExploreProvider (props) {
  const [maxZoneScore, setMaxZoneScore] = useQsState({
    key: 'maxZoneScore',
    default: undefined,
    hydrator: v => {
      const range = v ? v.split(',').map(Number) : null;

      return {
        name: 'Zone Score Range',
        id: 'zone-score-range',
        active: true,
        isRange: true,
        info: 'Filter zones by calculated zone score',
        input: {
          value: range ? { min: range[0], max: range[1] } : { min: 0, max: 1 },
          type: SLIDER,
          range: [0, 1]
        }
      };
    },
    dehydrator: v => v.active && `${v.input.value.min},${v.input.value.max}`
  });

  const [maxLCOE, setMaxLCOE] = useQsState({
    key: 'maxLCOE',
    default: undefined,
    hydrator: v => {
      const range = v ? v.split(',').map(Number) : null;

      return {
        name: 'LCOE Range',
        id: 'lcoe-range',
        active: range && true,
        isRange: true,
        unit: 'USD/MWh',
        info: 'Filter zones by calculated LCOE',
        input: {
          value: range ? { min: range[0], max: range[1] } : null,
          type: SLIDER,
          range: range || DEFAULT_RANGE
        }
      };
    },
    dehydrator: v => v.active && `${v.input.value.min},${v.input.value.max}`
  });

  // Init areas state
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  const [selectedAreaId, setSelectedAreaId] = useQsState({
    key: 'areaId',
    default: undefined
  });
  const [selectedResource, setSelectedResource] = useQsState({
    key: 'resourceId',
    default: undefined
  });

  const [gridMode, setGridMode] = useState(false);
  const [gridSize, setGridSize] = useState(GRID_OPTIONS[0]);

  const [tourStep, setTourStep] = useState(0);

  const [currentZones, dispatchCurrentZones] = useReducer(
    fetchZonesReducer,
    initialApiRequestState
  );

  const [filteredLayerUrl, setFilteredLayerUrl] = useState(null);
  const [outputLayerUrl, setOutputLayerUrl] = useState(null);

  // Executed on page mount
  useEffect(() => {
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }

    initAreasAndFilters();
    // fetchInputLayers(dispatchInputLayers);
  }, []);

  // Load eezs
  const initAreasAndFilters = async () => {
    showGlobalLoadingMessage('Initializing application...');
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
      areasJson
        .map((a) => {
          if (a.type === 'country') {
            a.id = a.gid;
            a.eez = eezCountries.get(a.id);
          }
          // Parse bounds, if a string
          if (a.bounds && typeof a.bounds === 'string') {
            a.bounds = a.bounds.split(',').map((x) => parseFloat(x));
          }

          return a;
        })
        .sort(function (a, b) {
          var nameA = a.name.toUpperCase();
          var nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        })
    );
    hideGlobalLoading();
  };

  // Handle selected area id changes
  useEffect(() => {
    // Clear current zones
    dispatchCurrentZones({ type: 'INVALIDATE_FETCH_ZONES' });

    // Set area object to context
    setSelectedArea(areas.find((a) => a.id === selectedAreaId));
  }, [selectedAreaId]);

  // Find selected area based on changes in id
  // Change options based on energy type
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
    localStorage.setItem('site-tour', tourStep);
  }, [tourStep]);

  const generateZones = async (filterString, weights, lcoe) => {
    showGlobalLoadingMessage(`Generating zones for ${selectedArea.name}, this may take a few minutes...`);
    fetchZones(
      gridMode && gridSize,
      selectedArea,
      selectedResource,
      filterString,
      weights,
      lcoe,
      dispatchCurrentZones
    );
  };

  const updateFilteredLayer = (filterValues, weights, lcoe) => {
    // Prepare a query string to the API based from filter values
    //
    const filterString = filterValues
      .map((filter) => {
        const { id, active, input, isRange } = filter;

        // Bypass inactive filters
        if (!maskTypes.includes(input.type) &&
            (!active || !checkIncluded(filter, selectedResource))) {
          // Skip filters that are NOT mask and are inactive
          return null;
        } else if (maskTypes.includes(input.type) && active) {
          // If this is an 'active' mask filter, we don't need to send to the api. Active here means include these areas
          return null;
        } else if (isRange) {
          if (input.value.min === input.range[0] &&
            input.value.max === input.range[1]) {
            return null;
          }
        }

        // Add accepted filter types to the query
        if (input.type === SLIDER) {
          const {
            value: { min, max }
          } = filter.input;

          // App uses km but api expects values in meters
          const multiplier = getMultiplierByUnit(filter.unit);
          return `${id}=${min * multiplier},${max * multiplier}`;
        } else if (input.type === BOOL) {
          return `${id}=${filter.input.value}`;
        } else if (input.type === MULTI) {
          return input.value.length === input.options.length ? null : `${id}=${input.value.join(',')}`;
        } else if (input.type === DROPDOWN || input.type === MULTI) {
          return `${id}=${filter.input.value.join(',')}`;
        } else {
        // discard non-accepted filter types
          /* eslint-disable-next-line */
          console.error(`Filter ${id} type not supported by api, discarding`);
          return null;
        }
      })
      .filter((x) => x)
      .join('&');

    // If area of country type, prepare path string to add to URL
    const countryPath = selectedArea.type === 'country' ? `${selectedArea.id}` : '';

    // Apply filter querystring to the map
    setFilteredLayerUrl(
      `${config.apiEndpoint}/filter/${countryPath}/{z}/{x}/{y}.png?${filterString}&color=54,166,244,80`
    );

    const lcoeReduction = Object.entries(lcoe).reduce((accum, [key, value]) => `${accum}&${key}=${value}`, '');

    setOutputLayerUrl(
      `${countryPath}/{z}/{x}/{y}.png?${filterString}&${lcoeReduction}&colormap=viridis`
    );

    generateZones(filterString, weights, lcoe);
  };

  useEffect(() => {
    if (currentZones.isReady()) {
      const zones = currentZones.getData();
      const value = zones.reduce((acc, z) => ({
        min: z.properties.summary.lcoe < acc.min ? z.properties.summary.lcoe : acc.min,
        max: z.properties.summary.lcoe > acc.max ? z.properties.summary.lcoe : acc.max
      }), { min: Infinity, max: 0 });

      setMaxLCOE({
        ...maxLCOE,
        active: true,
        input: {
          ...maxLCOE.input,
          value,
          range: [value.min, value.max]
        }
      });
    } else {
      setMaxLCOE({
        ...maxLCOE,
        active: false
      });
    }
  }, [currentZones]);

  return (
    <>
      <ExploreContext.Provider
        value={{

          areas,

          // output filters
          maxZoneScore,
          setMaxZoneScore,
          maxLCOE,
          setMaxLCOE,

          /* explore context */
          selectedArea,
          selectedAreaId,
          setSelectedAreaId,
          selectedResource,
          setSelectedResource,

          gridMode,
          setGridMode,
          gridSize,
          setGridSize,

          currentZones,
          generateZones,

          filteredLayerUrl,
          updateFilteredLayer,
          outputLayerUrl,
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
