import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Button from '../../styles/button/button';
import InfoButton from '../common/info-button';
import Prose from '../../styles/type/prose';
import ShadowScrollbar from '../common/shadow-scrollbar';
import SliderGroup from '../common/slider-group';
import { Accordion, AccordionFold, AccordionFoldTrigger } from '../../components/accordion';
import Heading from '../../styles/type/heading';
import { makeTitleCase } from '../../styles/utils/general';
import { apiResourceNameMap } from '../../components/explore/panel-data';

const TrayWrapper = styled(ShadowScrollbar)`
  padding: 0.25rem;
  height: 20rem;
`;
const ControlWrapper = styled.div`
  padding: 0.5rem 0;
  width: 100%;

  &:last-child {
    padding-bottom: 2rem;
  }
`;
const ControlHeadline = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  justify-content: space-between;
  align-items: baseline;

  ${Prose} {
    font-size: 0.875rem;
  }
`;
const ControlTools = styled.div`
  display: grid;
  grid-template-columns: 1fr 0 1fr;
  justify-content: end;
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
  padding: 0.5rem;
  overflow-x: hidden;
  ${AccordionFold} {
    padding-bottom: 1rem;

    &:first-of-type {
      padding-top: 2rem;
    }
  }
`;

function LayerControl (props) {
  const { id, name, onLayerKnobChange, onVisibilityToggle, visible } = props;
  const [knobPos, setKnobPos] = useState(75);

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
            title={visible ? 'toggle layer visibiliity' : 'Generate zones to view output layers'}
            hideText
            onClick={
              props.disabled
                ? null
                : () => {
                  onVisibilityToggle(props, !visible);
                }
            }
            visuallyDisabled={props.disabled}
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
          disabled={props.disabled || !visible}
        />
      </Legend>
    </ControlWrapper>
  );
}

LayerControl.propTypes = {
  id: T.string,
  name: T.string,
  disabled: T.bool,
  onLayerKnobChange: T.func,
  onVisibilityToggle: T.func,
  info: T.string,
  visible: T.bool
};

function RasterTray (props) {
  const { show, layers, onLayerKnobChange, onVisibilityToggle, className, resource } = props;

  /*
   * Reduce layers into categories.
   * Layers with out a category will be stored under `undefined`
   * These layers are displayed outside of the accordion
  */
  const categorizedLayers = layers.reduce((cats, layer) => {
    if (!resource || !layer.energy_type ||
    layer.energy_type.includes(apiResourceNameMap[resource])) {
      if (!cats[layer.category]) {
        cats[layer.category] = [];
      }
      cats[layer.category].push(layer);
    }
    return cats;
  }, {});

  return (
    <TrayWrapper
      className={className}
    >
      <LayersWrapper
        show={show}
      >
        {
          // Non categorized layers
          categorizedLayers[undefined] && categorizedLayers[undefined].map(l => (
            <LayerControl
              key={l.name}
              {...l}
              onLayerKnobChange={onLayerKnobChange}
              onVisibilityToggle={onVisibilityToggle}
            />

          ))
        }

        <Accordion
          allowMultiple
        >
          {({ checkExpanded, setExpanded }) => {
            return (
              Object.entries(categorizedLayers)
                .filter(cat => cat !== 'undefined')
                .map(([category, layers], idx) => {
                  return (category !== 'undefined' &&
                 <AccordionFold
                   key={category}
                   isFoldExpanded={checkExpanded(idx)}
                   setFoldExpanded={v => setExpanded(idx, v)}
                   renderHeader={({ isFoldExpanded, setFoldExpanded }) => (
                     <AccordionFoldTrigger
                       isExpanded={isFoldExpanded}
                       onClick={() => setFoldExpanded(!isFoldExpanded)}
                     >
                       <Heading size='small' variation='primary'>
                         {makeTitleCase(category.replace(/_/g, ' '))}
                       </Heading>
                     </AccordionFoldTrigger>
                   )}
                   renderBody={({ isFoldExpanded }) => (
                     layers.map(l => (
                       <LayerControl
                         key={l.id}
                         {...l}
                         onLayerKnobChange={onLayerKnobChange}
                         onVisibilityToggle={onVisibilityToggle}
                       />
                     )
                     )
                   )}
                 />
                  );
                }));
          }}

        </Accordion>
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
  className: T.string,
  resource: T.string
};

export default RasterTray;
