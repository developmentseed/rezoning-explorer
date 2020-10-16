import React from 'react';
import styled from 'styled-components';
import Button from '../../styles/button/button';
import Prose from '../../styles/type/prose';

import Tray from '../common/tray';
import GradientChart from '../common/gradient-legend-chart/chart';

const ControlWrapper = styled.div`
padding: 0.5rem;
width: 20rem;
`;
const ControlHeadline = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`;
const ControlTools = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-gap: 0.75rem;
`;
const Legend = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;

  > div:first-child {
    grid-column: 1 / -1;
  }

  .grad-max {
    text-align: right;
  }
`;

const LayersWrapper = styled.div`
  opacity: ${({ show }) => show ? 1 : 0};
  transition: opacity .16s ease 0s;
`;

const defaultStops = [
  'rgba(0, 0, 255, 0)',
  'rgba(0, 0, 255, 1)'
];

function LayerControl (props) {
  const { name, min, max, stops } = props;
  return (
    <ControlWrapper>
      <ControlHeadline>
        <Prose>{name}</Prose>
        <ControlTools>
          <Button
            id='layer-info'
            variation='base-plain'
            useIcon='circle-information'
            title='Open tour'
            hideText
          >
            <span>Open Tour</span>
          </Button>
          <Button
            id='layer-visibility'
            variation='base-plain'
            useIcon='eye'
            title='Open tour'
            hideText
          >
            <span>Open Tour</span>
          </Button>
        </ControlTools>
      </ControlHeadline>
      <Legend>
        <GradientChart
          stops={stops || defaultStops}
          knobPos={50}
          id={name}
          onAction={(a, p) => {
            console.log(a);
          }}
        />
        <Prose className='grad-min'>{min || 0}</Prose>
        <Prose className='grad-max'>{max || 1}</Prose>
      </Legend>
    </ControlWrapper>
  );
}
const layers = [
  { id: 'layer1', name: 'layer1' },
  { id: 'layer2', name: 'layer2' }

];

function RasterTray (props) {
  const { size, show } = props;
  return (
    <Tray
      size={size}
      show={show}
    >
      <LayersWrapper
        show={show}
      >
        {layers.map(l =>
          (<LayerControl
            key={l.name}
            name={l.name}
            id={l.id}
          />)
        )}
      </LayersWrapper>
    </Tray>
  );
}

export default RasterTray;
