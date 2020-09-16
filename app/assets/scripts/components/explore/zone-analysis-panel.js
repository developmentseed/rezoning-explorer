import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';

const PanelInner = styled.div`
  padding: 1rem 0;
  flex: 1;
  display: grid;
  grid-template-rows: auto 1fr;
`;

function ZoneAnalysisPanel (props) {
  const { currentZones, inputTouched } = props;

  return (
    <PanelInner>
      <ExploreStats zones={currentZones} active={inputTouched} />
      {currentZones && (
        <ExploreZones active={inputTouched} />
      )}
    </PanelInner>
  );
}
ZoneAnalysisPanel.propTypes = {
  currentZones: T.array,
  inputTouched: T.bool
};
export default ZoneAnalysisPanel;
