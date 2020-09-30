import React, { useContext } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Panel from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';
import ModalSelect from './modal-select';
import { ModalHeader } from '../common/modal';
import ModalSelectArea from './modal-select-area';

import Button from '../../styles/button/button';

import { Card } from '../common/card-list';

import QueryForm from './query-form';

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
    gridSize, setGridSize
  } = useContext(ExploreContext);

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
            </Button>

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
