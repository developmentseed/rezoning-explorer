import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Panel, { PanelHeadline, PanelTitle } from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';


import CountryFilterForm from './country-filter-form';

const COUNTRIES = ['Zambia', 'Nairobi', 'Mozambique'];
const RESOURCES = ['Solar', 'Wind'];
const WEIGHTS = [
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

const FILTERS = [
  { name: 'Zone Score', range: [0, 1] },
  { name: 'Mean Capacity Factor', range: [0, 1] },
  { name: 'Electricity Demand', range: [0, 100], unit: 'k' }
];

const LCOE = [
  { name: 'Generation - capital [USD/kW] (Cg)' },
  { name: 'Generation - fixed O&M [USED/MWh]' }
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
            weightsList={WEIGHTS}
            filtersList={FILTERS}
            lcoeList={LCOE}
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
