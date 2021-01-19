import * as topojson from 'topojson-client';
import { fetchJSON, makeAPIReducer } from './reduxeed';
import config from '../../config';
import get from 'lodash.get';
import zoneScoreColor from '../../styles/zoneScoreColors';
import theme from '../../styles/theme/theme';
import squareGrid from '@turf/square-grid';
import pLimit from 'p-limit';
import { wrapLogReducer } from './../contexeed';

const limit = pLimit(50);
const { apiEndpoint } = config;

async function getZoneSummary (feature, filterString, weights, lcoe, countryPath) {
  let summary = {};

  try {
    summary = (
      await fetchJSON(`${apiEndpoint}/zone${countryPath}?${filterString}`, {
        method: 'POST',
        body: JSON.stringify({
          aoi: feature.geometry,
          weights,
          lcoe
        })
      })
    ).body;
  } catch (error) {
    // eslint-disable-next-line
    console.log(`Error fetching zone ${feature.properties.id} analysis.`);
  }

  return {
    ...feature,
    id: feature.properties.id,
    properties: {
      color: theme.main.color.base,
      ...feature.properties,
      summary
    }
  };
}

export const fetchZonesReducer = wrapLogReducer(makeAPIReducer('FETCH_ZONES'));
/*
 * Make all asynchronous requests to load zone score from REZoning API
 * dispatch updates to some context using 'dispatch' function
 */
export async function fetchZones (
  grid,
  selectedArea,
  selectedResource,
  filterString,
  weights,
  lcoe,
  dispatch
) {
  dispatch({ type: 'REQUEST_FETCH_ZONES' });
  try {
    const { id: areaId, type } = selectedArea;

    let features;

    if (selectedResource === 'Off-Shore Wind') {
      // if offshore wind, we are already in grid and bounds are eez bounds
      features = squareGrid(selectedArea.bounds, grid, {
        units: 'kilometers',
        mask: {
          type: 'FeatureCollection',
          features: selectedArea.eez
        }
      }).features.map((ft, i) => ({ ...ft, properties: { id: i } }));
    } else {
      // Get area topojson
      const { body: zonesTopoJSON } = await fetchJSON(
        `/public/zones/${type}/${areaId}.topojson`
      );

      // Get sub areas from Topojson
      if (grid) {
        const areaLimits = topojson.merge(
          zonesTopoJSON,
          zonesTopoJSON.objects[areaId].geometries
        );

        const areaGrid = squareGrid(selectedArea.bounds, grid, {
          mask: areaLimits,
          units: 'kilometers'
        });

        features = areaGrid.features.map((ft, i) => ({
          ...ft,
          properties: { id: i }
        }));
      } else {
        const subAreas = topojson.feature(
          zonesTopoJSON,
          zonesTopoJSON.objects[areaId]
        ).features;

        // Set id from GID, if undefined
        features = subAreas.map((f) => {
          if (typeof f.properties.id === 'undefined') {
            f.properties.id = f.properties.GID_0;
          }
          return f;
        });
      }
    }

    // If area of country type, prepare path string to add to URL
    const countryPath = selectedArea.type === 'country' ? `/${selectedArea.id}` : '';

    // Fetch Lcoe for each sub-area
    const zones = await Promise.all(
      features.map((z) =>
        limit(() => getZoneSummary(z, filterString, weights, lcoe, countryPath))
      )
    );

    const maxScore = Math.max(
      ...zones.map((z) => get(z, 'properties.summary.zone_score', 0))
    );

    const data = zones.map((z) => {
      if (!get(z, 'properties.summary.zone_score')) return z;

      const zoneScore = z.properties.summary.zone_score / maxScore;
      const color = zoneScoreColor(zoneScore);

      return {
        ...z,
        properties: {
          ...z.properties,
          color,
          summary: {
            ...z.properties.summary,
            zone_score: zoneScore
          }
        }
      };
    });
    dispatch({ type: 'RECEIVE_FETCH_ZONES', data: data });
  } catch (err) {
    dispatch({ type: 'ERROR', error: err });
  }
}
