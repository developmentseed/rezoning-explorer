const path = require('path');
const fs = require('fs');
const readline = require('readline');

const baseFileDir = process.argv[2];
const regionsDir = process.argv[3];

let currentCountry = null;
let features = [];

function writeCurrent () {
  console.log(`writing ${currentCountry}`); // eslint-disable-line
  const fc = { type: 'FeatureCollection', features };
  fs.writeFileSync(
    path.join(regionsDir, `${currentCountry}.geojson`),
    JSON.stringify(fc)
  );
}

// group stream by country (GID_0)
readline
  .createInterface({
    input: fs.createReadStream(baseFileDir)
  })
  .on('line', (line) => {
    const feature = JSON.parse(line);
    const country = feature.properties.GID_0;
    if (country !== currentCountry && currentCountry) {
      writeCurrent();
      features = [];
    }
    feature.properties = {
      id: feature.properties.GID_1,
      name: feature.properties.NAME_1
    };
    currentCountry = country;
    features.push(feature);
  })
  .on('close', () => {
    writeCurrent();
  });
