import { saveAs } from 'file-saver';
import blobStream from 'blob-stream';
import { format } from '@fast-csv/format';
import { getTimestamp, round } from '../../../utils/format';
import config from '../../../config';
const { indicatorsDecimals } = config;

export default async function exportZonesCsv(selectedArea, zones) {
  const doc = format({ headers: true });

  const stream = doc.pipe(blobStream());

  // Parse zones
  const rows = zones
    .filter(
      ({
        /* eslint-disable camelcase */
        properties: {
          summary: { suitable_area }
        }
      }) => suitable_area > 0
    )
    .map(({ properties }) => {
      const { name, id, summary } = properties;

      let zone = {
        id,
        'Zone Score': round(summary.zone_score, indicatorsDecimals.zone_score),
        'Suitable Area (km²)': round(summary.suitable_area / 1000000, 0),
        'LCOE (USD/MWh)': round(summary.lcoe, indicatorsDecimals.lcoe),
        'Generation Potential (GWh)': round(
          summary.generation_potential,
          indicatorsDecimals.generation_potential
        ),
        'Zone Output Density (GWh/km²)': round(
          summary.zone_output_density,
          indicatorsDecimals.zone_output_density
        ),
        'Installed Capacity Potential (MW)': summary.icp,
        'Capacity Factor': round(summary.cf, indicatorsDecimals.cf)
      };

      // Add name if available
      if (name) zone = { Name: name, ...zone };

      return zone;
    });

  // Add zones to CSV
  rows.forEach((z) => doc.write(z));

  doc.end();

  return await stream.on('finish', function () {
    saveAs(
      stream.toBlob('text/plain;charset=utf-8'),
      `WBG-REZoning-${selectedArea.id}-zones-${getTimestamp()}.csv`
    );
  });
}
