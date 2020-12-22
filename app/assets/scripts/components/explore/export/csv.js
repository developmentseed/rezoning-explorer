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
    };

    // Add name if available
    if (name) zone.name = name;

    return zone;
  });

  // Add zones to CSV
  rows.forEach((z) => doc.write(z));

  doc.end();

  return await stream.on('finish', function () {
    saveAs(
      stream.toBlob('text/plain;charset=utf-8'),
      `rezoning-${selectedArea.id}-zones-${getTimestamp()}.csv`
    );
  });
}
