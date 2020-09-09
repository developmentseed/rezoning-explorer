import * as topojson from 'topojson-client';
import { fetchJSON } from '../context/reduxeed';
import config from '../config';

const { apiEndpoint } = config;

async function getZoneSummary (feature, filterString) {
  const zoneSummary = {
    id: feature.properties.id,
    name: feature.properties.name,
    color: '#2c2a59'
  };
  try {
    const { body } = await fetchJSON(
      `${apiEndpoint}/zone?filters=${filterString}`,
      {
        method: 'POST',
        body: JSON.stringify({
          aoi: feature.geometry,
          weights: {},
          lcoe: {}
        })
      }
    );

    // Add analysis to summary
    zoneSummary.analysis = body;
  } catch (error) {
    // eslint-disable-next-line
    console.log(`Error fetching zone ${zoneSummary.id} analysis.`);
  }

  return zoneSummary;
}

export default async function generateZones (areaId, filterString) {
  // Get area topojson
  const { body: allZonesTopoJSON } = await fetchJSON(
    `/public/zones/${areaId}.topojson`
  );

  // Parse topojson
  const { features: allZones } = topojson.feature(
    allZonesTopoJSON,
    allZonesTopoJSON.objects[areaId]
  );

  // Fetch Lcoe for each sub-area
  const results = await Promise.all(
    allZones.map((z) =>
      getZoneSummary(z, filterString)
    )
  );

  const maxScore = Math.max(
    ...results.map(({ analysis }) => (analysis ? analysis.zone_score : 0))
  );

  return results.map((z) => {
    if (!z.analysis) return z;

    return {
      ...z,
      analysis: {
        ...z.analysis,
        zone_score: (z.analysis.zone_score / maxScore)
      }
    };
  });
}
