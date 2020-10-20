import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Button from '../../styles/button/button';
import InfoButton from '../common/info-button';
import Prose from '../../styles/type/prose';
import GradientChart from '../common/gradient-legend-chart/chart';

const TrayWrapper = styled.div`
  padding: 0.25rem;
`;
const ControlWrapper = styled.div`
  padding: 0.5rem;
  width: 100%;
`;
const ControlHeadline = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  justify-content: space-between;
  align-items: baseline;
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
  const { id, name, min, max, stops, onLayerKnobChange, onVisibilityToggle } = props;
  const [knobPos, setKnobPos] = useState(50);
  const [visibility, setLayerVisibility] = useState(true);

  return (
    <ControlWrapper>
      <ControlHeadline>
        <Prose>{name}</Prose>
        <ControlTools>
          <InfoButton
            id='layer-info'
            info={props.info || null}
            disabled={!props.info}
          >
            <span>Open Tour</span>
          </InfoButton>
          <Button
            id='layer-visibility'
            variation='base-plain'
            useIcon={visibility ? 'eye' : 'eye-disabled'}
            title='toggle-layer-visibility'
            hideText
            onClick={() => {
              setLayerVisibility(!visibility);
              onVisibilityToggle(props, !visibility);
            }}
          >
            <span>Toggle Layer Visibility</span>
          </Button>
        </ControlTools>
      </ControlHeadline>
      <Legend>
        <GradientChart
          stops={stops || defaultStops}
          knobPos={knobPos}
          id={id}
          onAction={(a, p) => {
            onLayerKnobChange(props, p);
            setKnobPos(p.value);
          }}
          disableGradientScaling
        />
        <Prose size='small' className='grad-min'>{min || 0}</Prose>
        <Prose size='small' className='grad-max'>{max || 1}</Prose>
      </Legend>
    </ControlWrapper>
  );
}

LayerControl.propTypes = {
  id: T.string,
  name: T.string,
  min: T.number,
  max: T.number,
  stops: T.array,
  onLayerKnobChange: T.func,
  onVisibilityToggle: T.func,
  info: T.string
};

function RasterTray (props) {
  const { show, layers, onLayerKnobChange, onVisibilityToggle, className } = props;
  return (
    <TrayWrapper
      className={className}
    >
      <LayersWrapper
        show={show}
      >
        {layers.map(l => (
          <LayerControl
            key={l.name}
            {...l}
            onLayerKnobChange={onLayerKnobChange}
            onVisibilityToggle={onVisibilityToggle}
          />
        )
        )}
      </LayersWrapper>
    </TrayWrapper>
  );
}

RasterTray.propTypes = {
  size: T.oneOf(['small', 'medium', 'large', 'xlarge']),
  show: T.bool,
  layers: T.array,
  onLayerKnobChange: T.func,
  onVisibilityToggle: T.func,
  className: T.string
};

export default RasterTray;
