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
          <PanelBlock>
            <PanelBlockHeader>
              <PanelBlockTitle>Tools</PanelBlockTitle>
            </PanelBlockHeader>
            <PanelBlockBody />
          </PanelBlock>
        </>
      }
    />
  );
}

ExpMapPrimePanel.propTypes = {
};

export default ExpMapPrimePanel;
