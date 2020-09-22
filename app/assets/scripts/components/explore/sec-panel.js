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

import ExploreContext from '../../context/explore-context';
import ZoneAnalysisPanel from './zone-analysis-panel';

const SecPanel = styled(Panel)`
  ${media.largeUp`
    width: 18rem;
  `}
  ${media.xlargeUp`
    width: 20rem;
  `}
`;

function ExpMapSecPanel (props) {
  const { onPanelChange } = props;
  const { currentZones, inputTouched, zonesGenerated } = useContext(ExploreContext);

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
              <Heading size='large'>
                National
              </Heading>
            </PanelBlockHeader>
            <PanelBlockBody>
              <ZoneAnalysisPanel
                currentZones={currentZones}
                inputTouched={inputTouched}
                zonesGenerated={zonesGenerated}
              />
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
