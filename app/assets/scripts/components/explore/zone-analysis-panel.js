import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';
// import Button from '../../styles/button/button';

const PanelInner = styled.div`
  padding: 1rem 0;
  flex: 1;
  display: grid;
  grid-template-rows: auto 1fr auto 1fr;
`;
const ZoneRequest = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: center;
`;

function ZoneAnalysisPanel (props) {
  const {
    currentZones,
    // generateZones,
    inputTouched
    // zonesGenerated
  } = props;

  return (
    <PanelInner>
      <ZoneRequest>
        {/* {!zonesGenerated &&
          <Button
            as='a'
            useIcon={['layout-grid-3x3', 'before']}
            size='medium'
            onClick={generateZones}
            variation='primary-raised-dark'
          >
            Generate Zones
          </Button>} */}
      </ZoneRequest>
      <ExploreStats zones={currentZones} active={inputTouched} />
      <ZoneRequest>
        {/* {inputTouched &&
            zonesGenerated &&
          <Button
            as='a'
            useIcon={['layout-grid-3x3', 'before']}
            size='medium'
            onClick={generateZones}
            variation='primary-raised-dark'
          >
            Recalculate Zones
          </Button>} */}
      </ZoneRequest>

      {currentZones && (
        <ExploreZones zones={currentZones} active={inputTouched} />
      )}
    </PanelInner>
  );
}
ZoneAnalysisPanel.propTypes = {
  currentZones: T.object,
  // generateZones: T.func,
  inputTouched: T.bool
  // zonesGenerated: T.bool
};
export default ZoneAnalysisPanel;
