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

import Heading from '../../styles/type/heading';

import media, { isLargeViewport } from '../../styles/utils/media-queries';

import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 18rem;
  `}
`;

function ExpMapSecPanel (props) {
  const { onPanelChange } = props;
  return (
    <PrimePanel
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
              <ExploreStats />
              <ExploreZones />

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
