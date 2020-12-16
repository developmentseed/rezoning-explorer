import React, { useContext } from 'react';
import { saveAs } from 'file-saver';
import dataURItoBlob from '../../../utils/data-uri-to-blob';
import { format } from 'date-fns';
import exportPDF from './pdf';

import ExploreContext from '../../../context/explore-context';

import styled from 'styled-components';
import Button from '../../../styles/button/button';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../../common/dropdown';

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
async function exportMapImage() {
  const canvas = document.getElementsByClassName('mapboxgl-canvas')[0];
  const dataURL = canvas.toDataURL('image/png');
  saveAs(dataURItoBlob(dataURL), `rezoning-snapshot-${timestamp()}.png`);
}

const ExportZonesButton = () => {
  const {
    selectedResource,
    selectedArea,
    currentZones,
  } = useContext(ExploreContext);

  const data = {
    area: selectedArea,
    zones: currentZones.getData() || [],
    summary: [
      {
        title: 'Matching zones',
        value: '3 zones'
      },
      {
        title: 'Output by year',
        value: '42 GWh'
      },
      {
        title: 'Total Area',
        value: '200 km2'
      },
      {
        title: 'Output density',
        value: '300 MWh/km²'
      }
    ],
    filters: {
      Natural: [
        {
          title: 'Pop density',
          value: '0 - 2000'
        },
        {
          title: 'Slope',
          value: '0 - 6'
        },
        {
          title: 'Elevation',
          value: '0 - 1000'
        }
      ],
      Infrastructure: [
        {
          title: 'Pop density',
          value: '0 - 2000'
        },
        {
          title: 'Slope',
          value: '0 - 6'
        },
        {
          title: 'Elevation',
          value: '0 - 1000'
        }
      ],
      Environment: [
        {
          title: 'Pop density',
          value: '0 - 2000'
        },
        {
          title: 'Slope',
          value: '0 - 6'
        },
        {
          title: 'Elevation',
          value: '0 - 1000'
        }
      ],
      Cultural: [
        {
          title: 'Pop density',
          value: '0 - 2000'
        },
        {
          title: 'Slope',
          value: '0 - 6'
        },
        {
          title: 'Elevation',
          value: '0 - 1000'
        }
      ]
    }
  };

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
          <DropMenuItem useIcon='page-label' onClick={() => exportPDF(data)}>
            PDF Report
          </DropMenuItem>
          <DropMenuItem useIcon='map' onClick={() => exportMapImage()}>
            Map (.png)
          </DropMenuItem>
        </DropMenu>
      </Dropdown>
    </ExportWrapper>
  );
};

ExportZonesButton.propTypes = {};
export default ExportZonesButton;
