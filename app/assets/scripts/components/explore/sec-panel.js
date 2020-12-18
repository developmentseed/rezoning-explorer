import React, { useContext } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import Panel from '../common/panel';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockBody
} from '../common/panel-block';

import Heading from '../../styles/type/heading';

import media, { isLargeViewport } from '../../styles/utils/media-queries';
import Prose from '../../styles/type/prose';

import ExploreContext from '../../context/explore-context';
import FormContext from '../../context/form-context';

import ZoneAnalysisPanel from './zone-analysis-panel';

const SecPanel = styled(Panel)`
  ${media.largeUp`
    width: 18rem;
  `}
  ${media.xlargeUp`
    width: 22rem;
  `}
`;
const PreAnalysisMessage = styled(Prose)`
  padding: 1rem 1.5rem;
  text-align: center;
`;

function ExpMapSecPanel (props) {
  const { onPanelChange } = props;
  const { currentZones } = useContext(ExploreContext);
  const { inputTouched } = useContext(FormContext);

  return (
    <SecPanel
      collapsible
      direction='right'
      onPanelChange={onPanelChange}
      initialState={isLargeViewport()}
      bodyContent={
        <>
          <PanelBlock>
            <PanelBlockHeader>
              <Heading>
                Zone Analysis
              </Heading>
            </PanelBlockHeader>
            <PanelBlockBody>
              {currentZones.isReady()
                ? (
                  <ZoneAnalysisPanel
                    currentZones={currentZones.getData()}
                    inputTouched={inputTouched}
                  />) : (
                  <PreAnalysisMessage>{currentZones.fetching ? 'Loading...' : 'Apply parameters (Spatial filters, Weights & LCOE Economic inputs) and click "Generate Zones" to load zone analysis.'}</PreAnalysisMessage>
                )}
            </PanelBlockBody>
          </PanelBlock>
        </>
      }
    />
  );
}

ExpMapSecPanel.propTypes = {
  onPanelChange: T.func
};

export default ExpMapSecPanel;
