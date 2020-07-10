import React, { useContext } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Panel from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';

import QueryForm from './query-form';

import { resourceList, weightsList, filtersList, lcoeList } from './panel-data';

const PRESETS = [];

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 20rem;
  `}
`;

function ExpMapPrimePanel (props) {
  const { onPanelChange, onCountryEdit } = props;
  const { countries } = useContext(ExploreContext);

  const countryList = countries.isReady()
    ? countries.getData().countries.map(c => c.name) : [];

  return (
    <PrimePanel
      collapsible
      direction='left'
      onPanelChange={onPanelChange}
      initialState={isLargeViewport()}
      bodyContent={
        <>
          <QueryForm
            countryList={countryList}
            resourceList={resourceList}
            weightsList={weightsList}
            filtersList={filtersList}
            lcoeList={lcoeList}
            presetList={PRESETS}
            onCountryEdit={onCountryEdit}
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
