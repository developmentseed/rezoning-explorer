import React, { useContext } from 'react';
import T from 'prop-types';
import config from '../../../config';
import exportPDF from './pdf';
import { withRouter } from 'react-router';

import ExploreContext from '../../../context/explore-context';
import FormContext from '../../../context/form-context';
import {
  weightQsSchema,
  lcoeQsSchema,
  filterQsSchema
} from '../../../context/qs-state-schema';

import {
  showGlobalLoadingMessage,
  hideGlobalLoading
} from '../../../components/common/global-loading';

import styled from 'styled-components';
import Button from '../../../styles/button/button';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../../common/dropdown';
import QsState from '../../../utils/qs-state';
import toasts from '../../common/toasts';
import GlobalContext from '../../../context/global-context';
import { toTitleCase } from '../../../utils/format';
import exportZonesCsv from './csv';
import exportZonesGeoJSON from './geojson';
import exportCountryMap from './country-map';
import MapContext from '../../../context/map-context';

import { checkIncluded, getMultiplierByUnit, apiResourceNameMap } from '../panel-data';

const { apiEndpoint } = config;

const ExportWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
  ${Button} {
    width: 100%;
  }
`;

// Get lcoe values from search string
function getLcoeValues(location, selectedResource, lcoeList) {
  const lcoeSchema = lcoeList.reduce((acc, l) => {
    acc[l.id] = {
      accessor: l.id,
      hydrator: lcoeQsSchema(l, selectedResource).hydrator
    };
    return acc;
  }, {});
  const lcoeQsState = new QsState(lcoeSchema);
  const formValues = lcoeQsState.getState(location.search.substr(1));
  return Object.keys(formValues).reduce((acc, id) => {
    acc[id] = formValues[id].input.value;
    // Capacity factor should be an object here, but we need just the id prop
    if (id === 'capacity_factor') {
      acc[id] = acc[id].id;
    }
    return acc;
  }, {});
}

// Get weight values from search string
function getWeightValues(location, selectedResource, weightsList) {
  const weightsSchema = weightsList.reduce((acc, w) => {
    acc[w.id] = {
      accessor: w.id,
      hydrator: weightQsSchema(w).hydrator
    };
    return acc;
  }, {});
  const weightsQsState = new QsState(weightsSchema);
  const formValues = weightsQsState.getState(location.search.substr(1));
  return Object.keys(formValues).reduce((acc, id) => {
    acc[id] = formValues[id].input.value;
    return acc;
  }, {});
}

// Get filter values from search string
function getFilterValues(
  location,
  selectedResource,
  filtersLists,
  filterRanges
) {
  const filtersSchema = filtersLists.reduce((acc, w) => {
    acc[w.id] = {
      accessor: w.id,
      hydrator: filterQsSchema(w, filterRanges, selectedResource).hydrator
    };
    return acc;
  }, {});
  const filtersQsState = new QsState(filtersSchema);
  const formValues = filtersQsState.getState(location.search.substr(1));

  return Object.keys(formValues).reduce((acc, id) => {
    const filter = formValues[id];
    const multiplier = getMultiplierByUnit(filter.unit);
    let value = filter.input.value;
    if (!checkIncluded(filter, selectedResource)) {
      return acc;
    } else if (filter.isRange) {
      value = `${value.min * multiplier},${value.max * multiplier}`;
    } else if (Array.isArray(value)) {
      value = value.join(',');
    } else if (filter.input.type === 'boolean' && value === true) {
      // skip true booleans
      return acc;
    }
    acc[id] = value;
    return acc;
  }, {});
}

/**
 * The component
 */
const ExportZonesButton = (props) => {
  const { selectedResource, selectedArea, currentZones, gridMode, gridSize, maxZoneScore, maxLCOE } = useContext(
    ExploreContext
  );

  const { filtersLists, weightsList, lcoeList, filterRanges } = useContext(
    FormContext
  );

  const { map, setMap } = useContext(MapContext);

  const { setDownload } = useContext(GlobalContext);

  // This will parse current querystring to get values for filters/weights/lcoe
  // an pass to a function to generate the PDF
  function onExportPDFClick() {
    // Get filters values
    const filtersSchema = filtersLists.reduce((acc, w) => {
      acc[w.id] = {
        accessor: w.id,
        hydrator: filterQsSchema(w, filterRanges, selectedResource).hydrator
      };
      return acc;
    }, {});
    const filtersQsState = new QsState(filtersSchema);
    const filtersValues = filtersQsState.getState(
      props.location.search.substr(1)
    );

    // Get weights values
    const weightsSchema = weightsList.reduce((acc, w) => {
      acc[w.id] = {
        accessor: w.id,
        hydrator: weightQsSchema(w).hydrator
      };
      return acc;
    }, {});
    const weightsQsState = new QsState(weightsSchema);
    const weightsValues = weightsQsState.getState(
      props.location.search.substr(1)
    );

    // Get LCOE values
    const lcoeSchema = lcoeList.reduce((acc, l) => {
      acc[l.id] = {
        accessor: l.id,
        hydrator: lcoeQsSchema(l, selectedResource).hydrator
      };
      return acc;
    }, {});
    const lcoeQsState = new QsState(lcoeSchema);
    const lcoeValues = lcoeQsState.getState(props.location.search.substr(1));

    const data = {
      selectedResource,
      selectedArea,
      gridMode,
      gridSize,
      zones: currentZones.getData().filter(z => {
        // Filter by zone min/max lcoe/score
        /* eslint-disable camelcase */
        const { zone_score, lcoe } = z.properties.summary;
        const zs = zone_score >= maxZoneScore.input.value.min && zone_score <= maxZoneScore.input.value.max;
        const zl = maxLCOE ? (lcoe >= maxLCOE.input.value.min && lcoe <= maxLCOE.input.value.max) : true;
        return zs && zl;
      }),
      filtersValues,
      filterRanges: filterRanges.getData(),
      weightsValues,
      lcoeValues,
      maxZoneScore,
      maxLCOE
    };
    exportPDF(data, map, setMap);
  }

  async function onRawDataClick(operation) {
    if (selectedArea.type !== 'country') {
      toasts.error(
        'Raw data exports are restricted to countries at the moment.'
      );
      return;
    }

    try {
      showGlobalLoadingMessage('Requesting raw data export...');

      const res = await fetch(
        `${apiEndpoint}/export/${operation}/${selectedArea.id}/${apiResourceNameMap[selectedResource]}`,
        {
          method: 'POST',
          body: JSON.stringify({
            lcoe: getLcoeValues(props.location, selectedResource, lcoeList),
            weights: getWeightValues(
              props.location,
              selectedResource,
              weightsList
            ),
            filters: getFilterValues(
              props.location,
              selectedResource,
              filtersLists,
              filterRanges
            )
          })
        }
      );

      if (res.status >= 400) {
        const err = new Error(`Unexpected error (${res.status}).`);
        err.statusCode = res.status;
        throw err;
      }

      // Operation name to be used in labels
      const prettyOperation =
        operation === 'lcoe' ? operation.toUpperCase() : toTitleCase(operation);

      const { id } = await res.json();
      toasts.info(
        `${prettyOperation} raw data export for ${selectedArea.name} is being processed.`
      );
      setDownload({
        id,
        selectedArea,
        startedAt: Date.now(),
        prettyOperation,
        operation
      });
    } catch (error) {
      toasts.error('An unexpected error occurred. Please try again later.');
    } finally {
      hideGlobalLoading();
    }
  }
  // Conditional resource link for linking to GWA/GSA download pages
  let ResourceLink;
  if (selectedArea.type === 'country') {
    const countryName = selectedArea.name;
    selectedResource === 'Solar PV'
      ? (ResourceLink = `https://globalsolaratlas.info/download/${countryName}`)
      : (ResourceLink = `https://globalwindatlas.info/area/${countryName}?download=print`);
  }

  return (
    <ExportWrapper>
      <Dropdown
        alignment='right'
        direction='down'
        triggerElement={
          <Button
            useIcon='download'
            variation='primary-raised-dark'
            size='small'
          >
            Download
          </Button>
        }
      >
        <DropTitle>Download Options</DropTitle>
        <DropMenu role='menu' iconified>
          <DropMenuItem
            data-dropdown='click.close'
            useIcon='picture'
            onClick={() => exportCountryMap(selectedArea, selectedResource, gridMode, gridSize, map, setMap)}
          >
            Map (.pdf)
          </DropMenuItem>
          <DropMenuItem
            data-dropdown='click.close'
            useIcon='page-label'
            onClick={onExportPDFClick}
          >
            Report (.pdf)
          </DropMenuItem>
          <DropMenuItem
            data-dropdown='click.close'
            useIcon='link'
            href={ResourceLink}
            target='_blank'
            disabled={selectedArea.type !== 'country'}
          >
            Resource layers (link)
          </DropMenuItem>
          <DropMenuItem
            data-dropdown='click.close'
            useIcon='table'
            onClick={() => {
              exportZonesCsv(selectedArea, currentZones.getData());
            }}
          >
            Zones (.csv)
          </DropMenuItem>
          <DropMenuItem
            data-dropdown='click.close'
            useIcon='map'
            onClick={() => {
              exportZonesGeoJSON(selectedArea, currentZones.getData());
            }}
          >
            Zones (.geojson)
          </DropMenuItem>
          {selectedArea && selectedArea.type === 'country' && (
            <>
              <DropMenuItem
                data-dropdown='click.close'
                useIcon='globe'
                onClick={() => onRawDataClick('lcoe')}
              >
                LCOE (GeoTIFF)
              </DropMenuItem>
              <DropMenuItem
                data-dropdown='click.close'
                useIcon='globe'
                onClick={() => onRawDataClick('score')}
              >
                Score (GeoTIFF)
              </DropMenuItem>
            </>
          )}
        </DropMenu>
      </Dropdown>
    </ExportWrapper>
  );
};

ExportZonesButton.propTypes = {
  location: T.object
};
export default withRouter(ExportZonesButton);
