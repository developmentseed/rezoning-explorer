import { saveAs } from 'file-saver';
import blobStream from 'blob-stream';
import { format } from '@fast-csv/format';
import { getTimestamp } from '../../../utils/format';

export default async function exportZonesCsv (selectedArea, zones) {
  const doc = format({ headers: true });

  const stream = doc.pipe(blobStream());

  // Parse zones
  const rows = zones.map(({ properties }) => {
    const { name, id, summary } = properties;

    const zone = {
      id, ...summary
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
