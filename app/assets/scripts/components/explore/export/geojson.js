import { saveAs } from 'file-saver';
import { getTimestamp, round } from '../../../utils/format';
import config from '../../../config';
const { indicatorsDecimals } = config;

export default async function exportZonesGeoJSON (selectedArea, zones) {
  const featureCollection = {
    type: 'FeatureCollection',
    features: zones.map((z) => {
      const { summary } = z.properties;
      return {
        ...z,
        properties: {
          name: z.properties.name,
          id: z.id,
          zone_score: round(summary.zone_score, indicatorsDecimals.zone_score),
          lcoe_usd_mwh: round(summary.lcoe, indicatorsDecimals.lcoe),
          zone_output_gwh: round(
            summary.zone_output,
            indicatorsDecimals.zone_output
          ),
          zone_output_density_mwh_km2: round(
            summary.zone_output_density,
            indicatorsDecimals.zone_output_density
          )
        }
      };
    })
  };

  const blob = new Blob([JSON.stringify(featureCollection)], {
    type: 'text/plain;charset=utf-8'
  });

  saveAs(blob, `rezoning-${selectedArea.id}-zones-${getTimestamp()}.geojson`);
}
