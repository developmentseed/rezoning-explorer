import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { themeVal } from '../../styles/utils/general';
import useQsState from '../../utils/qs-state-hook';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockFooter
} from '../common/panel-block';
import TabbedBlockBody from '../common/tabbed-block-body';
import Button from '../../styles/button/button';
import Heading, { Subheading } from '../../styles/type/heading';

import GridSetter from './grid-setter';

import {
  INPUT_CONSTANTS,
  checkIncluded,
  apiResourceNameMap
} from './panel-data';
import { HeadOption, HeadOptionHeadline } from '../../styles/form/form';
import { FiltersForm, WeightsForm, LCOEForm } from './form';

import {
  initByType,
  castByFilterType,
  filterQsSchema,
  weightQsSchema,
  lcoeQsSchema
} from '../../context/qs-state-schema';
import { useFilteredLayer, useArea, useResource } from '../../context/explore-context';
import { useFormListsAndRanges } from '../../context/form-context';

const { GRID_OPTIONS } = INPUT_CONSTANTS;

const Subheadingstrong = styled.strong`
  color: ${themeVal('color.base')};
`;

export const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  useIcon: 'pencil',
  hideText: true
})`
  opacity: 50%;
  margin-left: auto;
`;

const SubmissionSection = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 0rem 1rem;
`;

function QueryForm(props) {
  const {
    onAreaEdit,
    onResourceEdit,
    onInputTouched,
    onSelectionChange,
    gridMode,
    setGridMode,
    gridSize,
    setGridSize
  } = props;

  const firstLoad = useRef(true);
  const { selectedArea } = useArea();
  const { selectedResource } = useResource();
  const { filtersLists, weightsList, lcoeList, filterRanges } = useFormListsAndRanges();
  const { updateFilteredLayer } = useFilteredLayer();

  /* Generate weights qs state variables
   */
  const weightsInd = weightsList.map((w) => {
    const [weight, setWeight] = useQsState(weightQsSchema(w));
    return [weight, setWeight];
  });

  /* Generate filters qs state variables */
  const filtersInd = filtersLists.map((f) => {
    const [filt, setFilt] = useQsState(
      filterQsSchema(f, filterRanges.getData(), selectedResource)
    );
    return [filt, setFilt];
  });

  const initialize = (baseList, destList, options) => {
    const { reset, apiRange } = options || {};
    baseList.forEach((base, ind) => {
      const [object, setObject] = destList[ind];
      if (object && !reset) {
        // This filter has been set via the url
        // Does not need to be initialized
        const updated = {
          ...object,
          input: {
            ...initByType(object, apiRange || {}, apiResourceNameMap[selectedResource])
          }
        };
        setObject(updated);
        return;
      }

      // Initialize the filter with default values
      setObject({
        ...base,
        input: {
          ...initByType(base, apiRange || {}, apiResourceNameMap[selectedResource])
        },
        active: base.active === undefined ? true : base.active
      });
    });
  };

  const lcoeInd = lcoeList.map((c) => {
    const [cost, setCost] = useQsState(lcoeQsSchema(c, selectedResource));
    return [cost, setCost];
  });

  const resetClick = useCallback(() => {
    initialize(filtersLists, filtersInd, { reset: true });
    initialize(weightsList, weightsInd, { reset: true });
    initialize(lcoeList, lcoeInd, { reset: true });
  }, [filtersLists, filtersInd, weightsList, weightsInd, lcoeList, lcoeInd]);

  /* Reduce filters, weights, and lcoe
   * Call function to send values to api
   */
  const applyClick = useCallback(() => {
    const weightsValues = weightsInd.reduce(
      (accum, [weight, _]) => ({
        ...accum,
        [weight.id || weight.name]: castByFilterType(weight.input.type)(
          weight.input.value
        )
      }),
      {}
    );

    const lcoeValues = lcoeInd.reduce(
      (accum, [cost, _]) => ({
        ...accum,
        [cost.id || cost.name]: castByFilterType(cost.input.type)(
          cost.input.value
        )
      }),
      {}
    );

    // Get filters and discard setting functions
    const filters = filtersInd.map(([filter, _]) => filter);

    updateFilteredLayer(filters, weightsValues, lcoeValues);
  }, [updateFilteredLayer, weightsInd, lcoeInd, filtersInd]);

  useEffect(() => {
    /* When filter ranges update we should reset to match ranges */
    initialize(filtersLists, filtersInd, {
      // On first load, we do not reset. Set values from url
      // On subsequent load, set values from range because ranges have changed
      reset: !firstLoad.current,
      apiRange: filterRanges.getData()
    });

    if (firstLoad.current && filterRanges.isReady()) {
      firstLoad.current = false;
    }
  }, [filterRanges, selectedResource]);

  useEffect(onInputTouched, [selectedArea, selectedResource]);
  useEffect(onSelectionChange, [selectedArea, selectedResource, gridSize]);

  /* Update capacity factor options based on
   * what the current resource is
   */
  useEffect(() => {
    if (selectedResource) {
      try {
        const [capacity, setCapacity] = lcoeInd.find(
          ([cost, _]) => cost.id === 'capacity_factor'
        );
        capacity.input.availableOptions =
          capacity.input.options[apiResourceNameMap[selectedResource]];
        capacity.input.value = capacity.input.availableOptions[0];
        setCapacity(capacity);
      } catch (err) {
        /* eslint-disable-next-line */
        console.error(err);
      }
    }
  }, [selectedResource]);

  /* Wait until elements have mounted and been parsed to render the query form */
  if (firstLoad.current) {
    return null;
  }

  return (
    <PanelBlock>
      <PanelBlockHeader>
        <HeadOption>
          <HeadOptionHeadline id='selected-area-prime-panel-heading'>
            <Heading size='large' variation='primary'>
              {selectedArea ? selectedArea.name : 'Select Area'}
            </Heading>
            <EditButton
              id='select-area-button'
              onClick={onAreaEdit}
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
              onClick={onResourceEdit}
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

      <TabbedBlockBody>
        <FiltersForm
          name='Filters'
          icon='filter'
          disabled={!selectedArea || !selectedResource}
          filters={filtersInd}
          checkIncluded={checkIncluded}
          resource={selectedResource}
        />
        <LCOEForm
          name='Economics'
          icon='disc-dollar'
          lcoe={lcoeInd}
          disabled={!selectedArea || !selectedResource}
        />
        <WeightsForm
          name='weights'
          icon='sliders-horizontal'
          weights={weightsInd}
          disabled={!selectedArea || !selectedResource}
        />
      </TabbedBlockBody>
      <SubmissionSection>
        <Button
          size='small'
          type='reset'
          disabled={!selectedArea || !selectedResource}
          onClick={resetClick}
          variation='primary-raised-light'
          useIcon='arrow-loop'
        >
          Reset
        </Button>
        <Button
          size='small'
          type='submit'
          disabled={!selectedArea || !selectedResource}
          onClick={applyClick}
          variation='primary-raised-dark'
          useIcon='tick--small'
          title={
            !selectedArea || !selectedResource
              ? 'Both area and resource must be set to generate zones'
              : 'Generate Zones Analysis'
          }
        >
          Generate Zones
        </Button>
      </SubmissionSection>
    </PanelBlock>
  );
}

QueryForm.propTypes = {
  onResourceEdit: T.func,
  onAreaEdit: T.func,
  onInputTouched: T.func,
  onSelectionChange: T.func,
  gridMode: T.bool,
  setGridMode: T.func,
  gridSize: T.number,
  setGridSize: T.func
};
if (process.env.NODE_ENV === 'development') {
  QueryForm.whyDidYouRender = false;
}

export default QueryForm;
