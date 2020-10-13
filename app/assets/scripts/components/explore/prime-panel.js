import React, { useContext, useState} from 'react';
import T from 'prop-types';
import styled, {css}from 'styled-components';
import Panel from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';
import ModalSelect from './modal-select';
import { ModalHeader } from '../common/modal';
import ModalSelectArea from './modal-select-area';

import Button from '../../styles/button/button';

import { Card } from '../common/card-list';

import QueryForm from './query-form';
import RasterTray from './raster-tray';

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
/*
const RasterTogglePanel = styled.div`
  ${({show}) => show ? css`
    max-width: 10rem;
    max-height: fit-content;
  ` : css`
    max-width: 0;
    max-height: 0;
  `};
  transition: max-width 1s ease 0s, max-height 0.16s ease 0s;
`;

const Test = styled.div`
  width: 10rem;
  height: 10rem;
`*/

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
    gridSize, setGridSize
  } = useContext(ExploreContext);

  const [showRasterPanel, setShowRasterPanel] = useState(false)

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
              <Button
              key='toggle-raster-tray'
              id='toggle-raster-tray'
              variation='base-plain'
              useIcon='iso-stack'
              title='Toggle Raster Tray'
              hideText
              onClick={() => setShowRasterPanel(!showRasterPanel)}
            >
              <span>Toggle Raster Tray</span>
            </Button>
              <RasterTray
                show={showRasterPanel}
                size={'small'}
              >
              </RasterTray>
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
