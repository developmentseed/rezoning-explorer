import * as topojson from 'topojson-client';
import { fetchJSON } from '../context/reduxeed';
import config from '../config';
import get from 'lodash.get';
import zoneScoreColor from '../styles/zoneScoreColors';
import theme from '../styles/theme/theme';
import squareGrid from '@turf/square-grid';
import pLimit from 'p-limit';
const limit = pLimit(50);
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

export default async function fetchZones (grid, selectedArea, filterString, weights, lcoe) {
  // Get area topojson
  const { id: areaId } = selectedArea;

  let features;

  if (grid) {
    features = squareGrid(selectedArea.bounds, grid, { units: 'kilometers' }).features
      .map((ft, i) => ({ ...ft, properties: { id: i } }));
  } else {
    const { body: zonesTopoJSON } = await fetchJSON(
    `/public/zones/${areaId}.topojson`
    );

    // Parse topojson
    features = topojson.feature(
      zonesTopoJSON,
      zonesTopoJSON.objects[areaId]
    ).features;
  }

  // Fetch Lcoe for each sub-area
  const zones = await Promise.all(
    features.map((z) => limit(() => getZoneSummary(z, filterString, weights, lcoe)))
  );

  const maxScore = Math.max(
    ...zones.map((z) => get(z, 'properties.summary.zone_score', 0))
  );

  return zones.map((z) => {
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
}
