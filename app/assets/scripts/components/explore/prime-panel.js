import React, { useContext, useState, useRef } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import Panel from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';
import MapContext from '../../context/map-context';
import FormContext from '../../context/form-context';

import ModalSelect from './modal-select';
import { ModalHeadline } from '@devseed-ui/modal';
import ModalSelectArea from './modal-select-area';

import Button from '../../styles/button/button';
import InfoButton from '../common/info-button';

import { Card } from '../common/card-list';

import QueryForm, { EditButton } from './query-form';
import RasterTray from './raster-tray';
import { ZONES_BOUNDARIES_LAYER_ID } from '../common/mb-map/mb-map';
import Heading, { Subheading } from '../../styles/type/heading';
import { PanelBlock, PanelBlockBody, PanelBlockHeader } from '../common/panel-block';
import { HeadOption, HeadOptionHeadline } from '../../styles/form/form';
import Prose from '../../styles/type/prose';
import GridSetter from './grid-setter';
import { INPUT_CONSTANTS } from './panel-data';
import { themeVal } from '../../styles/utils/general';

const { GRID_OPTIONS } = INPUT_CONSTANTS;

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 22rem;
  `}
`;

const RasterTrayWrapper = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  align-items: baseline;
  ${({ show }) => show && css`
    width: 20rem;
  `}

  > .info-button {
    grid-column: 1;
  }
  > ${Subheading} {
    grid-column: 2;
    ${({ show }) => !show && 'display: none;'}

  }

  > .raster-tray {
    grid-column: 1 /span 2;
    ${({ show }) => !show && 'display: none;'}

  }
`;

const PreAnalysisMessage = styled(Prose)`
  padding: 1rem 1.5rem;
  text-align: center;
`;

const Subheadingstrong = styled.strong`
  color: ${themeVal('color.base')};
`;

function ExpMapPrimePanel (props) {
  const { onPanelChange } = props;

  const firstLoad = useRef(true);

  /**
   * Get Explore context values
   */
  const {
    areas,
    setSelectedAreaId,
    availableResources,
    selectedResource,
    selectedArea,
    setSelectedResource,
    tourStep,
    setTourStep,
    gridMode,
    setGridMode,
    gridSize, setGridSize,
    updateFilteredLayer
  } = useContext(ExploreContext);
  const {
    showSelectAreaModal,
    setShowSelectAreaModal,
    showSelectResourceModal,
    setShowSelectResourceModal,
    setZonesGenerated,
    setInputTouched,
    filtersLists,
    weightsList,
    lcoeList,
    filterRanges
  } = useContext(FormContext);

  const {
    map,
    mapLayers, setMapLayers
  } = useContext(MapContext);

  const [showRasterPanel, setShowRasterPanel] = useState(false);

  return (
    <>
      <PrimePanel
        collapsible
        additionalControls={[
          <Button
            key='open-tour-trigger'
            id='open-tour-trigger'
            variation='base-plain'
            useIcon='circle-question'
            title='Open tour'
            hideText
            onClick={() => setTourStep(0)}
            disabled={tourStep >= 0}
          >
            <span>Open Tour</span>
          </Button>,

          <RasterTrayWrapper key='toggle-raster-tray' show={showRasterPanel}>
            <InfoButton
              id='toggle-raster-tray'
              className='info-button'
              variation='base-plain'
              useIcon='iso-stack'
              info='Toggle contextual layers'
              width='20rem'
              hideText
              onClick={() => {
                setShowRasterPanel(!showRasterPanel);
              }}
            >
              <span>Contextual Layers</span>
            </InfoButton>
            <Subheading>Contextual Layers</Subheading>

            <RasterTray
              show={showRasterPanel}
              className='raster-tray'
              layers={mapLayers}
              resource={selectedResource}
              onLayerKnobChange={(layer, knob) => {
                // Check if changes are applied to zones layer, which
                // have conditional paint properties due to filters
                if (layer.id === ZONES_BOUNDARIES_LAYER_ID) {
                  const paintProperty = map.getPaintProperty(
                    layer.id,
                    'fill-opacity'
                  );

                  // Zone boundaries layer uses a feature-state conditional
                  // to detect hovering.
                  // Here set the 3rd element of the array, which is the
                  // non-hovered state value
                  // to be the value of the knob
                  paintProperty[3] = knob / 100;
                  map.setPaintProperty(layer.id, 'fill-opacity', paintProperty);
                } else {
                  map.setPaintProperty(
                    layer.id,
                    layer.type === 'vector' ? 'fill-opacity' : 'raster-opacity',
                    knob / 100
                  );
                }
              }}
              onVisibilityToggle={(layer, visible) => {
                if (visible) {
                  if (layer.type === 'raster' && !layer.nonexclusive) {
                    const ml = mapLayers.map((l) => {
                      if (l.type === 'raster' && !l.nonexclusive) {
                        map.setLayoutProperty(
                          l.id,
                          'visibility',
                          l.id === layer.id ? 'visible' : 'none'
                        );
                        l.visible = l.id === layer.id;
                      }
                      return l;
                    });
                    setMapLayers(ml);
                  } else {
                    map.setLayoutProperty(layer.id, 'visibility', 'visible');
                    const ind = mapLayers.findIndex((l) => l.id === layer.id);
                    setMapLayers([
                      ...mapLayers.slice(0, ind),
                      {
                        ...layer,
                        visible: true
                      },
                      ...mapLayers.slice(ind + 1)
                    ]);
                  }
                } else {
                  map.setLayoutProperty(layer.id, 'visibility', 'none');
                  const ind = mapLayers.findIndex((l) => l.id === layer.id);
                  setMapLayers([
                    ...mapLayers.slice(0, ind),
                    {
                      ...layer,
                      visible: false
                    },
                    ...mapLayers.slice(ind + 1)
                  ]);
                }
              }}
            />
          </RasterTrayWrapper>
        ]}
        direction='left'
        onPanelChange={onPanelChange}
        initialState={isLargeViewport()}
        bodyContent={
          filtersLists && weightsList && lcoeList ? (
            <QueryForm
              firstLoad={firstLoad}
              area={selectedArea}
              resource={selectedResource}
              filtersLists={filtersLists}
              filterRanges={filterRanges}
              updateFilteredLayer={updateFilteredLayer}
              weightsList={weightsList}
              lcoeList={lcoeList}
              gridMode={gridMode}
              setGridMode={setGridMode}
              gridSize={gridSize}
              setGridSize={setGridSize}
              onAreaEdit={() => setShowSelectAreaModal(true)}
              onResourceEdit={() => setShowSelectResourceModal(true)}
              onInputTouched={(status) => {
                setInputTouched(true);
              }}
              onSelectionChange={() => {
                setZonesGenerated(false);
              }}
            />
          ) : (
            <PanelBlock>
              <PanelBlockHeader>
                <HeadOption>
                  <HeadOptionHeadline id='selected-area-prime-panel-heading'>
                    <Heading size='large' variation='primary'>
                      {filterRanges && selectedArea ? selectedArea.name : 'Select Area'}
                    </Heading>
                    <EditButton
                      id='select-area-button'
                      onClick={() => setShowSelectAreaModal(true)}
                      title='Edit Area'
                    >
                      Edit Area Selection
                    </EditButton>
                  </HeadOptionHeadline>
                </HeadOption>

                <HeadOption>
                  <HeadOptionHeadline id='selected-resource-prime-panel-heading'>
                    <Subheading>Resource: </Subheading>
                    <Subheading variation='primary'>
                      <Subheadingstrong>
                        {selectedResource || 'Select Resource'}
                      </Subheadingstrong>
                    </Subheading>
                    <EditButton
                      id='select-resource-button'
                      onClick={() => setShowSelectResourceModal(true)}
                      title='Edit Resource'
                    >
                      Edit Resource Selection
                    </EditButton>
                  </HeadOptionHeadline>
                </HeadOption>

                <HeadOption>
                  <HeadOptionHeadline>
                    <Subheading>Zone Type and Size: </Subheading>
                    <Subheading variation='primary'>
                      <Subheadingstrong>
                        {gridMode ? `${gridSize} km²` : 'Boundaries'}
                      </Subheadingstrong>
                    </Subheading>

                    <GridSetter
                      gridOptions={GRID_OPTIONS}
                      gridSize={gridSize}
                      setGridSize={setGridSize}
                      gridMode={gridMode}
                      setGridMode={setGridMode}
                      disableBoundaries={selectedResource === 'Off-Shore Wind'}
                    />
                  </HeadOptionHeadline>
                </HeadOption>
              </PanelBlockHeader>
              <PanelBlockBody>
                {selectedArea && selectedResource ? (
                  <PreAnalysisMessage> Loading parameters... </PreAnalysisMessage>
                ) : (
                  <PreAnalysisMessage>
                    Select Area and Resource to view and interact with input
                    parameters.
                  </PreAnalysisMessage>
                )}
              </PanelBlockBody>
            </PanelBlock>
          )
        }
      />
      <ModalSelect
        revealed={showSelectResourceModal && !showSelectAreaModal}
        onOverlayClick={() => {
          setShowSelectResourceModal(false);
        }}
        onCloseClick={() => {
          setShowSelectResourceModal(false);
        }}
        data={availableResources}
        closeButton={typeof selectedResource !== 'undefined'}
        renderHeadline={() => (
          <ModalHeadline
            id='select-resource-modal-header'
            title='Select Resource'
            style={{ flex: 1, textAlign: 'center' }}
          >
            <h1>Select Resource</h1>
          </ModalHeadline>
        )}
        renderCard={(resource) => (
          <Card
            id={`resource-${resource.name}-card`}
            key={resource.name}
            title={resource.name}
            size='large'
            borderlessMedia
            iconPath={resource.iconPath}
            onClick={() => {
              setShowSelectResourceModal(false);
              setSelectedResource(resource.name);
            }}
          />
        )}
        nonScrolling
      />

      <ModalSelectArea
        areas={areas}
        closeButton={typeof selectedArea !== 'undefined'}
        selectedResource={selectedResource}
        showSelectAreaModal={showSelectAreaModal}
        setShowSelectAreaModal={setShowSelectAreaModal}
        setSelectedAreaId={setSelectedAreaId}
      />
    </>
  );
}

ExpMapPrimePanel.propTypes = {
  onPanelChange: T.func
};

export default ExpMapPrimePanel;
