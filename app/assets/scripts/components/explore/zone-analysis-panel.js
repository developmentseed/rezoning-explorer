import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';
import Button from '../../styles/button/button';

const GenerateZones = styled.div`
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: center;
`;

function ZoneAnalysisPanel (props) {
  const { currentZones, generateZones } = props;
  return (
    <>
      <GenerateZones>
        <Button
          as='a'
          useIcon={['layout-grid-3x3', 'before']}
          size='medium'
          onClick={generateZones}
          variation='primary-raised-dark'
        >
          Generate Zones
        </Button>
      </GenerateZones>
      <ExploreStats
        zones={currentZones}
      />
      {currentZones.isReady() &&
      <ExploreZones
        zones={currentZones}
      />}
    </>
  );
}
ZoneAnalysisPanel.propTypes = {
  currentZones: T.object,
  generateZones: T.func
};
export default ZoneAnalysisPanel;
