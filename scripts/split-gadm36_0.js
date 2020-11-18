// const path = require('path');
// const fs = require('fs');
// const readline = require('readline');
// const readline = require('readline');

// const allRegions = require('./regions.geojson').regions;

// const regions = allRegions.reduce((acc, r) => {
//   acc[r.id] = {
//     type: 'FeatureCollection',
//     properties: r,
//     features: []
//   };
//   return acc;
// }, {});

// const baseFileDir = process.argv[2];
// const regionsDir = process.argv[3];

// let currentCountry = null;
// let features = [];

// function writeCurrent() {
//   console.log(`writing ${currentCountry}`); // eslint-disable-line
//   const fc = { type: 'FeatureCollection', features };
//   fs.writeFileSync(
//     path.join(regionsDir, `${currentCountry}.geojson`),
//     JSON.stringify(fc)
//   );
// }

// group stream by country (GID_0)
// readline
//   .createInterface({
//     input: fs.createReadStream(baseFileDir)
//   })
//   .on('line', (line) => {
//     const feature = JSON.parse(line);
//     const countryId = feature.properties.GID_0;

// Object.keys(regions).forEach((rId) => {
// if (regions[rId].properties.territories.includes(countryId)) {
//   regions[rId].features.push(feature);
// }
// });

//     // console.log(country);
//     // if (country !== currentCountry && currentCountry) {
//     //   writeCurrent();
//     //   features = [];
//     // }
//     // feature.properties = {
//     //   id: feature.properties.GID_1,
//     //   name: feature.properties.NAME_1
//     // };
//     // currentCountry = country;
//     // features.push(feature);
//   })
//   .on('close', () => {
//     console.log(regions)
//     // writeCurrent();
//   });

/* eslint-disable no-console */

const gadm0File = process.argv[2];
const targetDir = process.argv[3];

const fs = require('fs-extra');
const path = require('path');
const LineByLine = require('n-readlines');

const liner = new LineByLine(gadm0File);
const allRegions = require('./regions.json').regions;
const regions = allRegions.reduce((acc, r) => {
  acc[r.id] = {
    type: 'FeatureCollection',
    properties: r,
    features: []
  };
  return acc;
}, {});

const regionsIds = Object.keys(regions);

(async function () {
  let line;
  let lineNumber = 0;

  while ((line = liner.next())) {
    console.log(`Reading line ${lineNumber}...`);
    // Include country feature in respective regions
    regionsIds
      // .filter((id) => id === 'black-sea')
      .forEach((rId) => {
        const { territories } = regions[rId].properties;

        const feature = JSON.parse(line);
        const countryId = feature.properties.GID_0;
        if (territories.includes(countryId)) {
          regions[rId].features = regions[rId].features.concat(feature);
        }
      });
    lineNumber++;
  }

  // Write region files
  for (let i = 0; i < regionsIds.length; i++) {
    const regionId = regionsIds[i];
    console.log(`Writing ${regionId}.geojson...`);
    await fs.writeJSON(
      path.join(targetDir, `${regionId}.geojson`),
      regions[regionId],
      { spaces: 2 }
    );
  }

  console.log(targetDir);

  console.log('end of line reached');
})();
