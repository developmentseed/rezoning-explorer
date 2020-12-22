import { saveAs } from 'file-saver';
import { getTimestamp } from '../../../utils/format';

export default async function exportZonesGeoJSON (selectedArea, zones) {
  const featureCollection = {
    type: 'FeatureCollection',
    features: zones.map((z) => {
      return {
        ...z,
        properties: {
          name: z.properties.name,
          id: z.id,
          ...z.properties.summary
        }
      };
    })
  };

  const blob = new Blob([JSON.stringify(featureCollection)], {
    type: 'text/plain;charset=utf-8'
  });

  saveAs(blob, `rezoning-${selectedArea.id}-zones-${getTimestamp()}.geojson`);
}
