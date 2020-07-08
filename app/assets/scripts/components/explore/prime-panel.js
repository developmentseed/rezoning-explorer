import React, { useContext } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Panel, { PanelHeadline, PanelTitle } from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';

import QueryForm from './query-form';

const PRESETS = [];

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 18rem;
  `}
`;

function ExpMapPrimePanel (props) {
  const { onPanelChange } = props;
  const { resources, countries, queryParams } = useContext(ExploreContext);

  const resourceList = resources.isReady() ? resources.getData().resources : [];
  const countryList = countries.isReady() ? countries.getData().countries : [];
  const { weightsList, lcoeList, filtersList } = queryParams.isReady() ? queryParams.getData() : { weightsList: [], lcoeList: [], filtersList: [] };

  return (
    <PrimePanel
      collapsible
      direction='left'
      onPanelChange={onPanelChange}
      initialState={isLargeViewport()}
      headerContent={(
        <PanelHeadline>
          <PanelTitle>Explore</PanelTitle>
        </PanelHeadline>
      )}
      bodyContent={
        <>
          <QueryForm
            countryList={countryList}
            resourceList={resourceList}
            weightsList={weightsList}
            filtersList={filtersList}
            lcoeList={lcoeList}
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
