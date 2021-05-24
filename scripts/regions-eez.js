const { featureCollection } = require('@turf/helpers');
const simplify = require('@turf/simplify');
const topojson = require('topojson-client');

const fs = require('fs-extra');

async function main() {
  const eez = await fs.readJSON('./app/public/zones/eez_v11.topojson');

  const { features: eezFeatures } = topojson.feature(eez, eez.objects.eez_v11);
  const eezCountries = eezFeatures.reduce((accum, z) => {
    const id = z.properties.ISO_TER1;
    accum.set(id, [...(accum.has(id) ? accum.get(id) : []), z]);
    return accum;
  }, new Map());

  const regions = (await fs.readJSON('./scripts/regions.json')).regions.map(
    (r) => {
      const eezs = r.territories
        .map((tId) => eezCountries.get(tId))
        .filter((z) => typeof z !== 'undefined')
        .flat();

      return {
        id: r.id,
        geojson: simplify(featureCollection(eezs), {
          tolerance: 0.05,
          highQuality: true
        })
      };
    }
  );

  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    await fs.writeJSON(`./app/public/eez-regions/${region.id}.geojson`, region.geojson);
  }
}

main();
