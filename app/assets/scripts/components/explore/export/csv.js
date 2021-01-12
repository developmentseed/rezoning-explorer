import { saveAs } from 'file-saver';
import blobStream from 'blob-stream';
import { format } from '@fast-csv/format';
import { getTimestamp, round } from '../../../utils/format';
import config from '../../../config';
const { indicatorsDecimals } = config;

export default async function exportZonesCsv (selectedArea, zones) {
  const doc = format({ headers: true });

  const stream = doc.pipe(blobStream());

  // Parse zones
  const rows = zones.map(({ properties }) => {
    const { name, id, summary } = properties;

    const zone = {
      id,
      'Zone Score': round(summary.zone_score, indicatorsDecimals.zone_score),
      'LCOE (USD/MWh)': round(summary.lcoe, indicatorsDecimals.lcoe),
      'Zone Output (GWh)': round(
        summary.zone_output,
        indicatorsDecimals.zone_output
      ),
      'Zone Output Density (MWh/km²)': round(
        summary.zone_output_density,
        indicatorsDecimals.zone_output_density
      )
    };

    // Add name if available
    if (name) zone.Name = name;

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
