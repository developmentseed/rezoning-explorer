import React, { useContext, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Panel from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';
import ModalSelect from './modal-select';
import { ModalHeader } from '../common/modal';
import ModalSelectArea from './modal-select-area';

import Button from '../../styles/button/button';
import InfoButton from '../common/info-button';

import { Card } from '../common/card-list';

import QueryForm from './query-form';
import RasterTray from './raster-tray';
import { mapLayers } from '../common/mb-map/mb-map';
import theme from '../../styles/theme/theme';
import { rgba } from 'polished';

import {
  resourceList,
  weightsList,
  filtersLists,
  lcoeList,
  presets
} from './panel-data';

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 20rem;
  `}
`;
function ExpMapPrimePanel (props) {
  const { onPanelChange } = props;

  /**
   * Get Explore context values
   */
  const {
    selectedResource,
    selectedArea,
    setSelectedResource,
    showSelectAreaModal,
    setShowSelectAreaModal,
    showSelectResourceModal,
    setShowSelectResourceModal,
    setInputTouched,
    setZonesGenerated,
    tourStep,
    setTourStep,
    gridMode,
    setGridMode,
    gridSize, setGridSize,
    filteredLayerUrl,
    map
  } = useContext(ExploreContext);

  const [showRasterPanel, setShowRasterPanel] = useState(false);

  return (
    <>
      <PrimePanel
        collapsible
        additionalControls={
          [
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

            <>
              <InfoButton
                key='toggle-raster-tray'
                id='toggle-raster-tray'
                variation='base-plain'
                useIcon='iso-stack'
                title='Toggle Raster Tray'
                info='info'
                hideText
                visuallyDisabled={!filteredLayerUrl}
                onClick={() => {
                  if (filteredLayerUrl)
                    setShowRasterPanel(!showRasterPanel)}
                }
              >
                <span>Toggle Raster Tray</span>
              </InfoButton>

              <RasterTray
                show={showRasterPanel}
                size='large'
                layers={
                  mapLayers.map(l => ({
                    id: l.id,
                    name: l.name,
                    min: l.min || 0,
                    max: l.max || 1,
                    type: l.type,
                    stops: l.stops || [
                      rgba(theme.main.color.primary, 0),
                      rgba(theme.main.color.primary, 1)
                    ]
                  }))
                }
                onLayerKnobChange={(layer, knob) => {
                  map.setPaintProperty(layer.id,
                    layer.type === 'vector' ? 'fill-opacity' : 'raster-opacity',
                    knob.value / 100);
                }}
                onVisibilityToggle={(layer, visible) => {
                  map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none')
                }}
              />
            </>

          ]
        }
        direction='left'
        onPanelChange={onPanelChange}
        initialState={isLargeViewport()}
        bodyContent={
          <>
            <QueryForm
              area={selectedArea}
              resource={selectedResource}
              weightsList={weightsList}
              filtersLists={filtersLists}
              lcoeList={lcoeList}
              presets={presets}
              gridMode={gridMode}
              setGridMode={setGridMode}
              gridSize={gridSize}
              setGridSize={setGridSize}
              onAreaEdit={() => setShowSelectAreaModal(true)}
              onResourceEdit={() => setShowSelectResourceModal(true)}
              onInputTouched={() => {
                setInputTouched(true);
              }}
              onSelectionChange={() => {
                setZonesGenerated(false);
              }}
            />
          </>
        }
      />
      <ModalSelect
        revealed={showSelectResourceModal && !showSelectAreaModal}
        onOverlayClick={() => {
          if (selectedResource) {
            setShowSelectResourceModal(false);
          }
        }}
        data={resourceList}
        renderHeader={() => (
          <ModalHeader
            id='select-resource-modal-header'
            title='Select Resource'
          />
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

      <ModalSelectArea />
    </>
  );
}

ExpMapPrimePanel.propTypes = {
  onPanelChange: T.func
};

export default ExpMapPrimePanel;
