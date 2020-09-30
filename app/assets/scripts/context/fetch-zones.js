import * as topojson from 'topojson-client';
import { fetchJSON, makeAPIReducer } from '../context/reduxeed';
import config from '../config';
import get from 'lodash.get';
import zoneScoreColor from '../styles/zoneScoreColors';
import theme from '../styles/theme/theme';
import { wrapLogReducer } from './contexeed';

const { apiEndpoint } = config;

async function getZoneSummary (feature, filterString, weights, lcoe) {
  let summary = {};

  try {
    summary = (
      await fetchJSON(`${apiEndpoint}/zone?filters=${filterString}`, {
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
export async function fetchZones (areaId, filterString, weights, lcoe, dispatch) {
  dispatch({ type: 'REQUEST_FETCH_ZONES' });
  try {
  // Get area topojson
    const { body: zonesTopoJSON } = await fetchJSON(
    `/public/zones/${areaId}.topojson`
    );

    // Parse topojson
    const { features } = topojson.feature(
      zonesTopoJSON,
      zonesTopoJSON.objects[areaId]
    );

    // Fetch Lcoe for each sub-area
    const zones = await Promise.all(
      features.map((z) => getZoneSummary(z, filterString, weights, lcoe))
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
