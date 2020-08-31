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
  const { currentZones, generateZones, inputTouched, firstQuery } = props;
  return (
    <>
      <GenerateZones>
        {inputTouched &&
          <Button
            as='a'
            useIcon={['layout-grid-3x3', 'before']}
            size='medium'
            onClick={generateZones}
            variation='primary-raised-dark'
          >
            {firstQuery ? 'Generate Zones' : 'Regenerate Zones'}
          </Button>}
      </GenerateZones>
      <ExploreStats
        zones={currentZones}
        active={inputTouched}
      />
      {currentZones.isReady() &&
        <ExploreZones
          zones={currentZones}
          active={inputTouched}
        />}
    </>
  );
}
ZoneAnalysisPanel.propTypes = {
  currentZones: T.object,
  generateZones: T.func,
  inputTouched: T.bool,
  firstQuery: T.bool
};
export default ZoneAnalysisPanel;
