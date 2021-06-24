const path = require('path');
const fs = require('fs');
const readline = require('readline');

const baseFileDir = process.argv[2];
const regionsDir = process.argv[3];

let currentCountry = null;
let features = [];

const antimeridianCountries = ['USA', 'RUS', 'KIR', 'FJI'];

// Recursive function to move point of polygons to the west
// if country crosses antimeridian
function correctPolygon(arrayElement) {
  // Check if arrayElement is a coordinate pair
  if (
    arrayElement.length === 2 &&
    typeof arrayElement[0] === 'number' &&
    typeof arrayElement[1] === 'number'
  ) {
    return arrayElement[0] > 0
      ? [arrayElement[0] - 360, arrayElement[1]]
      : arrayElement;
  }

  return arrayElement.map((el) => correctPolygon(el));
}

function writeCurrent() {
  console.log(`writing ${currentCountry}`); // eslint-disable-line

  if (antimeridianCountries.includes(currentCountry)) {
    features = features
      .map((f) => {
        f.geometry.coordinates = f.geometry.coordinates.map((polygon) =>
          correctPolygon(polygon)
        );
        return f;
      });
  }

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
