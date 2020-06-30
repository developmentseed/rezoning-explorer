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

function ExpMapSecPanel (props) {
  const { onPanelChange } = props;
  return (
    <PrimePanel
      collapsible
      direction='right'
      onPanelChange={onPanelChange}
      initialState={isLargeViewport()}
      headerContent={(
        <PanelHeadline>
          <PanelTitle>Secondary Panel</PanelTitle>
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

ExpMapSecPanel.propTypes = {
  onPanelChange: T.func
};

export default ExpMapSecPanel;
