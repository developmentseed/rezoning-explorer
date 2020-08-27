const fs = require('fs')
const readline = require('readline')

console.log(process.argv[2])

let currentCountry = null
let features = []

function writeCurrent () {
  console.log(`writing ${currentCountry}`);
  const fc = { type: 'FeatureCollection', features }
  fs.writeFileSync(`regions/${currentCountry}.geojson`, JSON.stringify(fc))
}

// group stream by country (GID_0)
readline.createInterface({
    input: fs.createReadStream(process.argv[2])
}).on('line', line => {
  const feature = JSON.parse(line)
  const country = feature.properties.GID_0
  if (country !== currentCountry && currentCountry) {
    writeCurrent()
    features = []
  }
  feature.properties = {
    id: feature.properties.GID_1,
    name: feature.properties.NAME_1
  }
  currentCountry = country
  features.push(feature)
}).on('close', () => {
  writeCurrent()
})



