#!/bin/zsh

# Set path references
TMP_PATH=.tmp
GADM_PATH=$TMP_PATH/gadm
GADM_UNZIPPED_PATH=$TMP_PATH/gadm_unzipped
REGIONS_PATH=$TMP_PATH/regions

# Create diretories
mkdir $TMP_PATH/regions
mkdir $REGIONS_PATH/simplified
mkdir $REGIONS_PATH/quantized

# Download original file, if not already downloaded
# wget -c https://biogeo.ucdavis.edu/data/gadm3.6/gadm36_levels_shp.zip -P $GADM_PATH

# # Expand
# unzip -o $GADM_PATH/gadm36_levels_shp.zip -d $TMP_PATH/gadm_unzipped 

# # Transform to GeoJSON
# ./node_modules/.bin/shp2json --newline-delimited $GADM_UNZIPPED_PATH/gadm36_1.shp > $GADM_UNZIPPED_PATH/base.geojson

# # Explode into countries
# node ./scripts/separate_admin.js $GADM_UNZIPPED_PATH/base.geojson $REGIONS_PATH

# For each country, generate optimized TopoJSON
for country in $REGIONS_PATH/*.geojson; do
  filename=$(basename -- "$country")
  countrycode="${filename%.*}"
  countryfile="$REGIONS_PATH/${countrycode}"
  echo "Parsing ${countryfile}"
  cat $country | ./node_modules/.bin/simplify-geojson -t 0.01 > $REGIONS_PATH/simplified/${countrycode}.geojson
  ./node_modules/.bin/geo2topo $REGIONS_PATH/simplified/${countrycode}.geojson > $REGIONS_PATH/simplified/${countrycode}.topojson
  ./node_modules/.bin/topoquantize 1e5 < $REGIONS_PATH/simplified/${countrycode}.topojson > $REGIONS_PATH/quantized/${countrycode}.topojson
;done

# Clear temporary folder 
# rm -rf $GADM_PATH
# rm -rf $GADM_UNZIPPED_PATH
# rm -rf $REGIONS_PATH
