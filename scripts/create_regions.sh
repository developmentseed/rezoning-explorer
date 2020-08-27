#!/bin/bash
wget https://biogeo.ucdavis.edu/data/gadm3.6/gadm36_levels_shp.zip
unzip gadm36_levels_shp.zip -d gadm_unzipped 
./node_modules/.bin/shp2json --newline-delimited gadm_unzipped/gadm36_1.shp > gadm_unzipped/base.geojson
mkdir regions
node ./scripts/separate_admin.js gadm_unzipped/base.geojson
cp -r regions/ app/assets/data/
rm -rf regions/
rm -rf gadm_unzipped
rm -rf gadm36_levels_shp.zip