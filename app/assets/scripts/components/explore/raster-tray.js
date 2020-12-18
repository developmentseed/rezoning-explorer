import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Button from '../../styles/button/button';
import InfoButton from '../common/info-button';
import Prose from '../../styles/type/prose';
import ShadowScrollbar from '../common/shadow-scrollbar';
import SliderGroup from '../common/slider-group';

const TrayWrapper = styled(ShadowScrollbar)`
  padding: 0.25rem;
  height: 20rem;
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
  grid-template-columns: repeat(auto-fill, minmax(1.5rem, 1fr));
  justify-content: end;
  grid-gap: 0.75rem;
  #layer-visibility {
    grid-column: end;
  }
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

function LayerControl (props) {
  const { id, name, onLayerKnobChange, onVisibilityToggle, visible } = props;
  const [knobPos, setKnobPos] = useState(50);

  return (
    <ControlWrapper>
      <ControlHeadline>
        <Prose>{name}</Prose>
        <ControlTools>
          {props.info &&
            <InfoButton
              id={`${id}-info`}
              info={props.info || null}
            >
              <span>Open Tour</span>
            </InfoButton>}
          <Button
            id='layer-visibility'
            variation='base-plain'
            useIcon={visible ? 'eye' : 'eye-disabled'}
            title='toggle-layer-visibility'
            hideText
            onClick={() => {
              onVisibilityToggle(props, !visible);
            }}
          >
            <span>Toggle Layer Visibility</span>
          </Button>
        </ControlTools>
      </ControlHeadline>
      <Legend>
        <SliderGroup
          id={id}
          value={knobPos}
          onChange={(val) => {
            setKnobPos(val);
            onLayerKnobChange(props, val);
          }}
          range={[0, 100]}
          disabled={!visible}
        />
      </Legend>
    </ControlWrapper>
  );
}

LayerControl.propTypes = {
  id: T.string,
  name: T.string,
  onLayerKnobChange: T.func,
  onVisibilityToggle: T.func,
  info: T.string,
  visible: T.bool
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
