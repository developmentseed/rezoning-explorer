import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Panel, { PanelHeadline, PanelTitle } from '../common/panel';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockTitle,
  PanelBlockBody
} from '../common/panel-block';

import media, { isLargeViewport } from '../../styles/utils/media-queries';

import CountryFilterForm from './country-filter-form';

const COUNTRIES = ['Zambia', 'Nairobi', 'Mozambique'];
const RESOURCES = ['Solar', 'Wind'];
const FILTERS = [
  { name: 'Grid Size', range: [1, 24], unit: 'km^2' },
  { name: 'LCOE Generation' },
  { name: 'LOCOE Transmission' },
  { name: 'LCOE Road' },
  { name: 'Distance to Load Centers' },
  { name: 'Technology Co-Location' },
  { name: 'Human Footprint' },
  { name: 'Population Density' },
  { name: 'Slope' },
  { name: 'Land Use Score' },
  { name: 'Capacity Value (Wind Only)' }
];
const PRESETS = [];

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 18rem;
  `}
`;

function ExpMapPrimePanel (props) {
  const { onPanelChange } = props;

  return (
    <PrimePanel
      collapsible
      direction='left'
      onPanelChange={onPanelChange}
      initialState={isLargeViewport()}
      headerContent={(
        <PanelHeadline>
          <PanelTitle>Prime Panel</PanelTitle>
        </PanelHeadline>
      )}
      bodyContent={
        <>
          <CountryFilterForm
            countryList={COUNTRIES}
            resourceList={RESOURCES}
            filterList={FILTERS}
            presetList={PRESETS}
          />
        </>
      }
    />
  );
}

ExpMapPrimePanel.propTypes = {
  onPanelChange: T.func
};

export default ExpMapPrimePanel;
