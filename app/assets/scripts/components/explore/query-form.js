import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { themeVal } from '../../styles/utils/general';
import useQsState from '../../utils/qs-state-hook';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockBody,
  PanelBlockFooter
} from '../common/panel-block';
import TabbedBlockBody from '../common/tabbed-block-body';
import Button from '../../styles/button/button';
import Heading, { Subheading } from '../../styles/type/heading';

import GridSetter from './grid-setter';

import { INPUT_CONSTANTS, checkIncluded, apiResourceNameMap } from './panel-data';
import { HeadOption, HeadOptionHeadline } from '../../styles/form/form';
import { FiltersForm, WeightsForm, LCOEForm } from './form';
import Prose from '../../styles/type/prose';

import {
  initByType,
  castByFilterType,
  filterQsSchema,
  weightQsSchema,
  lcoeQsSchema
} from '../../context/qs-state-schema';

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

const PreAnalysisMessage = styled(Prose)`
  padding: 1rem 1.5rem;
  text-align: center;
`;

function QueryForm(props) {
  const {
    area,
    resource,
    filtersLists,
    weightsList,
    lcoeList,
    updateFilteredLayer,
    filterRanges,
    onAreaEdit,
    onResourceEdit,
    onInputTouched,
    onSelectionChange,
    gridMode,
    setGridMode,
    gridSize, setGridSize,

    firstLoad
  } = props;

  /* Generate weights qs state variables
  */
  const weightsInd = weightsList.map(w => {
    const [weight, setWeight] = useQsState(weightQsSchema(w));
    return [weight, setWeight];
  });
  const [weightsLocks, setWeightLocks] = useState({});

  /* Generate filters qs state variables */
  const filtersInd = filtersLists.map((f) => {
    const [filt, setFilt] = useQsState(
      filterQsSchema(f, filterRanges.getData(), resource)
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
            ...initByType(object,
              apiRange || {},
              apiResourceNameMap[resource])
          }
        };
        setObject(updated);
        return;
      }

      // Initialize the filter with default values
      setObject({
        ...base,
        input: {
          ...initByType(base,
            apiRange || {},
            apiResourceNameMap[resource])
        },
        active: base.active === undefined ? true : base.active
      });
    });
  };

  const lcoeInd = lcoeList.map((c) => {
    const [cost, setCost] = useQsState(lcoeQsSchema(c, resource));
    return [cost, setCost];
  });

  const resetClick = () => {
    if (filterRanges.isReady()) {
      initialize(filtersLists, filtersInd, { reset: true, apiRange: filterRanges.getData() });
    } else {
      initialize(filtersLists, filtersInd, { reset: true });
    }
    initialize(lcoeList, lcoeInd, { reset: true });

    // Apply defaults to weights
    weightsInd.forEach(([w, setW]) => {
      setW({
        ...w,
        input: {
          ...w.input,
          value: w.input.default
        }
      });
    });

    // Clear weight locks
    setWeightLocks({});
  };

  /* Reduce filters, weights, and lcoe
   * Call function to send values to api
   */
  const applyClick = () => {
    const weightsValues = weightsInd.reduce((accum, [weight, _]) => ({
      ...accum,
      // The frontend deals with weights as 0 - 100
      // Convert to 0 - 1 decimal value before sending to backend
      [weight.id || weight.name]: castByFilterType(weight.input.type)(weight.input.value) / 100
    }), {});

    const lcoeValues = lcoeInd.reduce((accum, [cost, _]) => {
      const val = castByFilterType(cost.input.type)(cost.input.value);
      return ({
        ...accum,
        // Percentage values are served as decimal, rendered as integer 0 - 100
        [cost.id || cost.name]: cost.isPercentage ? val / 100 : val
      });
    }, {});

    // Get filters and discard setting functions
    const filters = filtersInd.map(([filter, _]) => filter);

    updateFilteredLayer(filters, weightsValues, lcoeValues);
  };
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
  }, [filterRanges, resource]);

  useEffect(onInputTouched, [area, resource]);
  useEffect(onSelectionChange, [area, resource, gridSize]);

  /* Update capacity factor options based on
   * what the current resource is
   */
  useEffect(() => {
    if (resource) {
      try {
        const [capacity, setCapacity] = lcoeInd.find(([cost, _]) => cost.id === 'capacity_factor');
        capacity.input.availableOptions = capacity.input.options[apiResourceNameMap[resource]];
        capacity.input.value = capacity.input.availableOptions[0];
        capacity.name = resource === 'Solar PV' ? 'Solar Unit Type' : 'Turbine Type';
        setCapacity(capacity);
      } catch (err) {
        /* eslint-disable-next-line */
        console.error(err);
      }
    }
  }, [resource]);

  /* Wait until elements have mounted and been parsed to render the query form */
  if (firstLoad.current) {
    return (
      <PanelBlock>
        <PanelBlockHeader>
          <HeadOption>
            <HeadOptionHeadline id='selected-area-prime-panel-heading'>
              <Heading size='large' variation='primary'>
                {area ? area.name : 'Select Area'}
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
                  {resource || 'Select Resource'}
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
                disableBoundaries={resource === 'Off-Shore Wind'}
              />
            </HeadOptionHeadline>
          </HeadOption>
        </PanelBlockHeader>
        <PanelBlockBody>
          <PreAnalysisMessage>
            Select Area and Resource to view and interact with input parameters.
          </PreAnalysisMessage>
        </PanelBlockBody>
        <SubmissionSection>
          <Button
            size='small'
            type='reset'
            disabled={!area || !resource}
            onClick={resetClick}
            variation='primary-raised-light'
            useIcon='arrow-loop'
          >
            Reset
          </Button>
          <Button
            id='generate-zones'
            size='small'
            type='submit'
            disabled={!area || !resource}
            onClick={applyClick}
            variation='primary-raised-dark'
            useIcon='tick--small'
            title={
              !area || !resource
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

  return (
    <PanelBlock>
      <PanelBlockHeader>
        <HeadOption>
          <HeadOptionHeadline id='selected-area-prime-panel-heading'>
            <Heading size='large' variation='primary'>
              {area ? area.name : 'Select Area'}
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
                {resource || 'Select Resource'}
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
              disableBoundaries={resource === 'Off-Shore Wind'}
            />
          </HeadOptionHeadline>
        </HeadOption>
      </PanelBlockHeader>

      <TabbedBlockBody>
        <FiltersForm
          id='filters-tab'
          name='Filters'
          icon='filter'
          disabled={!area || !resource}
          filters={filtersInd}
          checkIncluded={checkIncluded}
          resource={resource}
        />
        <LCOEForm
          id='economics-tab'
          name='Economics'
          icon='disc-dollar'
          lcoe={lcoeInd}
          disabled={!area || !resource}
        />
        <WeightsForm
          id='weights-tab'
          name='weights'
          icon='sliders-horizontal'
          weights={weightsInd}
          disabled={!area || !resource}
          weightsLocks={weightsLocks}
          setWeightLocks={setWeightLocks}
        />
      </TabbedBlockBody>
      <SubmissionSection>
        <Button
          size='small'
          type='reset'
          disabled={!area || !resource}
          onClick={resetClick}
          variation='primary-raised-light'
          useIcon='arrow-loop'
        >
          Reset
        </Button>
        <Button
          id='generate-zones'
          size='small'
          type='submit'
          disabled={!area || !resource}
          onClick={applyClick}
          variation='primary-raised-dark'
          useIcon='tick--small'
          title={
            !area || !resource
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
  area: T.object,
  resource: T.string,
  filtersLists: T.array,
  weightsList: T.array,
  lcoeList: T.array,
  updateFilteredLayer: T.func,
  filterRanges: T.object,
  onResourceEdit: T.func,
  onAreaEdit: T.func,
  onInputTouched: T.func,
  onSelectionChange: T.func,
  gridMode: T.bool,
  setGridMode: T.func,
  gridSize: T.number,
  setGridSize: T.func,
  firstLoad: T.object
};

export default QueryForm;
