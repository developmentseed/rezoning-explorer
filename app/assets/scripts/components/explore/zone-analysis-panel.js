import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';

const PanelInner = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 1rem 1.5rem;
`;

function ZoneAnalysisPanel (props) {
  const { currentZones, inputTouched } = props;

  return (
    <PanelInner>
      <ExploreStats zones={currentZones} active={inputTouched} />
      {currentZones && (
        <ExploreZones active={inputTouched} currentZones={currentZones} />
      )}
    </PanelInner>
  );
}
ZoneAnalysisPanel.propTypes = {
  currentZones: T.array,
  inputTouched: T.bool
};
export default ZoneAnalysisPanel;
