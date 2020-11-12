#!/bin/zsh

# Set path references
TMP_PATH=.tmp
GADM_PATH=$TMP_PATH/gadm
GADM_UNZIPPED_PATH=$TMP_PATH/gadm_unzipped
COUNTRIES_PATH=$TMP_PATH/countries
REGIONS_PATH=$TMP_PATH/regions
PUBLIC_ZONES_PATH=app/public/zones

# Create diretories
# mkdir -p $TMP_PATH/regions

mkdir -p $COUNTRIES_PATH/simplified
mkdir -p $COUNTRIES_PATH/quantized
mkdir -p $PUBLIC_ZONES_PATH/countries # output dir

mkdir -p $REGIONS_PATH/simplified
mkdir -p $REGIONS_PATH/quantized
mkdir -p $PUBLIC_ZONES_PATH/regions # output dir

# Download original file, if not already downloaded
wget -c https://biogeo.ucdavis.edu/data/gadm3.6/gadm36_levels_shp.zip -P $GADM_PATH

# Expand
unzip -o $GADM_PATH/gadm36_levels_shp.zip -d $TMP_PATH/gadm_unzipped 

################### 
# PROCESS REGIONS
###################

# Parse shapes to GeoJSON
./node_modules/.bin/shp2json --newline-delimited $GADM_UNZIPPED_PATH/gadm36_0.shp > $GADM_UNZIPPED_PATH/gadm36_0.geojson

# Split gadm36_0 GeoJSON into regions
node ./scripts/split-gadm36_0.js $GADM_UNZIPPED_PATH/gadm36_0.geojson $REGIONS_PATH

# For each country, generate optimized TopoJSON
for region in $REGIONS_PATH/*.geojson; do
  filename=$(basename -- "$region")
  regioncode="${filename%.*}"
  regionfile="$REGIONS_PATH/${regioncode}"
  echo "Parsing ${regionfile}"
  cat $region | ./node_modules/.bin/simplify-geojson -t 0.01 > $REGIONS_PATH/simplified/${regioncode}.geojson
  ./node_modules/.bin/geo2topo $REGIONS_PATH/simplified/${regioncode}.geojson > $REGIONS_PATH/simplified/${regioncode}.topojson
  ./node_modules/.bin/topoquantize 1e5 < $REGIONS_PATH/simplified/${regioncode}.topojson > $REGIONS_PATH/quantized/${regioncode}.topojson
  cp $REGIONS_PATH/quantized/${regioncode}.topojson $PUBLIC_ZONES_PATH/regions
;done

#####################
# PROCESS COUNTRIES
#####################

# Parse shapes to GeoJSON
./node_modules/.bin/shp2json --newline-delimited $GADM_UNZIPPED_PATH/gadm36_1.shp > $GADM_UNZIPPED_PATH/gadm36_1.geojson

# # Explode into countries
node ./scripts/split-gadm36_1.js $GADM_UNZIPPED_PATH/gadm36_1.geojson $COUNTRIES_PATH

# For each country, generate optimized TopoJSON
for country in $COUNTRIES_PATH/*.geojson; do
  filename=$(basename -- "$country")
  countrycode="${filename%.*}"
  countryfile="$COUNTRIES_PATH/${countrycode}"
  echo "Parsing ${countryfile}"
  cat $country | ./node_modules/.bin/simplify-geojson -t 0.01 > $COUNTRIES_PATH/simplified/${countrycode}.geojson
  ./node_modules/.bin/geo2topo $COUNTRIES_PATH/simplified/${countrycode}.geojson > $COUNTRIES_PATH/simplified/${countrycode}.topojson
  ./node_modules/.bin/topoquantize 1e5 < $COUNTRIES_PATH/simplified/${countrycode}.topojson > $COUNTRIES_PATH/quantized/${countrycode}.topojson
  cp $COUNTRIES_PATH/quantized/${countrycode}.topojson $PUBLIC_ZONES_PATH/countries
;done

# Clear temporary folder (uncomment to execute)
# rm -rf $GADM_PATH
# rm -rf $GADM_UNZIPPED_PATH
# rm -rf $REGIONS_PATH
# rm -rf $COUNTRIES_PATH
