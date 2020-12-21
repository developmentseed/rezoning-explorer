import React, { useContext } from 'react';
import T from 'prop-types';
import { saveAs } from 'file-saver';
import dataURItoBlob from '../../../utils/data-uri-to-blob';
import { format } from 'date-fns';
import exportPDF from './pdf';
import { withRouter } from 'react-router';

import ExploreContext from '../../../context/explore-context';
import FormContext from '../../../context/form-context';
import {
  weightQsSchema,
  lcoeQsSchema,
  filterQsSchema
} from '../../../context/qs-state-schema';

import styled from 'styled-components';
import Button from '../../../styles/button/button';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../../common/dropdown';
import QsState from '../../../utils/qs-state';

const ExportWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
  ${Button} {
    width: 100%;
  }
`;

// Helper function to generate a formatted timestamp
const timestamp = () => format(Date.now(), 'yyyyMMdd-hhmmss');

/**
 * Generate map snapshot and download.
 *
 * Reference: https://stackoverflow.com/questions/49807311/how-to-get-usable-canvas-from-mapbox-gl-js
 */
async function exportMapImage () {
  const canvas = document.getElementsByClassName('mapboxgl-canvas')[0];
  const dataURL = canvas.toDataURL('image/png');
  saveAs(dataURItoBlob(dataURL), `rezoning-snapshot-${timestamp()}.png`);
}

const ExportZonesButton = (props) => {
  const { selectedResource, selectedArea, currentZones } = useContext(
    ExploreContext
  );

  const { filtersLists, weightsList, lcoeList, filterRanges } = useContext(
    FormContext
  );

  // This will parse current querystring to get values for filters/weights/lcoe
  // an pass to a function to generate the PDF
  function onExportPDFClick () {
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
    const lcoeValues = lcoeQsState.getState(
      props.location.search.substr(1)
    );

    const data = {
      selectedResource,
      selectedArea,
      zones: currentZones.getData(),
      filtersValues,
      filterRanges: filterRanges.getData(),
      weightsValues,
      lcoeValues
    };
    exportPDF(data);
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
            disabled={selectedArea.type === 'region'}
            title={selectedArea.type === 'region' ? 'Regional resources can not be downloaded at this time' : 'Download country zone information, maps and data'}
          >
            Download
          </Button>
        }
      >
        <DropTitle>Download Options</DropTitle>
        <DropMenu role='menu' iconified>
          <DropMenuItem useIcon='page-label' onClick={onExportPDFClick}>
            PDF Report
          </DropMenuItem>
          <DropMenuItem useIcon='picture' onClick={() => exportMapImage()}>
            Map (.png)
          </DropMenuItem>
        </DropMenu>
      </Dropdown>
    </ExportWrapper>
  );
};

ExportZonesButton.propTypes = {
  location: T.object
};
export default withRouter(ExportZonesButton);
