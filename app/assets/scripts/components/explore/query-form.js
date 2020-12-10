import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { themeVal } from '../../styles/utils/general';
import useQsState from '../../utils/qs-state-hook';
import Dropdown from '../common/dropdown';
import { FormCheckable } from '../../styles/form/checkable';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockFooter
} from '../common/panel-block';
import TabbedBlockBody from '../common/tabbed-block-body';
import Button from '../../styles/button/button';
import SliderGroup from '../common/slider-group';
import StressedFormGroupInput from '../common/stressed-form-group-input';
import Heading, { Subheading } from '../../styles/type/heading';
import { validateRangeNum } from '../../utils/utils';

import GridSetter from './grid-setter';
import { truncated } from '../../styles/helpers';

import { round } from '../../utils/format';
import { INPUT_CONSTANTS, checkIncluded, apiResourceNameMap } from './panel-data';
import FormSelect from '../../styles/form/select';
import { FormGroup } from '../../styles/form/group';
import { HeadOption, HeadOptionHeadline } from './form/form';
import { FiltersForm, WeightsForm, LCOEForm } from './form';
import ShadowScrollbar from '../common/shadow-scrollbar';

const { SLIDER, BOOL, DROPDOWN, MULTI, TEXT, GRID_OPTIONS, DEFAULT_RANGE } = INPUT_CONSTANTS;

const maxZoneScoreO = {
  name: 'Zone Score Range',
  id: 'zone-score-range',
  active: true,
  isRange: true,
  input: {
    value: { min: 0, max: 1 },
    type: SLIDER,
    range: [0, 1]
  }
};

/*
const maxLCOE = {
  name: 'LCOE Range',
  id: 'lcoe-range',
  active: true,
  isRange: true,
  input: {
    value: { min: 0, max: 1 },
    type: SLIDER,
    range: [0, 1]
  }
}; */

const castByFilterType = type => {
  switch (type) {
    case BOOL:
      return Boolean;
    case DROPDOWN:
    case MULTI:
    case TEXT:
      return String;
    case SLIDER:
      return Number;
    default:
      return String;
  }
};

const MultiSelectButton = styled(Button)`
  width: 100%;
  ${truncated()}
`;
const MultiWrapper = styled(ShadowScrollbar)`
  height: 20rem;
  > .scroll-area {
    > div {
      display: grid;
      grid-template-rows: repeat(auto-fill, minmax(1.5rem, 1fr));
    }
  }
`;
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
  grid-template-columns: 1fr 1fr;
  gap: 0rem 1rem;
`;

const initByType = (obj, ranges, resource) => {
  const apiRange = ranges[obj.id];
  const { input, options } = obj;

  const range = (apiRange && [round(apiRange.min), round(apiRange.max)]) || obj.input.range || DEFAULT_RANGE;

  switch (input.type) {
    case SLIDER:
      return {
        ...input,
        range,
        unit: input.unit,
        value: input.value || input.default || (obj.isRange ? { min: round(range[0]), max: round(range[1]) } : range[0])
      };
    case TEXT:
      return {
        ...input,
        range: input.range || DEFAULT_RANGE,
        unit: input.unit,
        value: input.value || input.default || (input.range || DEFAULT_RANGE)[0]
      };
    case BOOL:
      return {
        ...input,
        value: false,
        range: [true, false]
      };
    case MULTI:
      return {
        ...input,
        // For multi select use first option as default value
        value: input.value || [0],
        unit: null
      };
    case DROPDOWN:
      return {
        ...input,
        value: obj.value || (
          options[resource] && options[resource][0]) || '',
        availableOptions: options[resource] || [],
        unit: null
      };
    default:
      return {};
  }
};

function QueryForm (props) {
  const {
    area,
    resource,
    filtersLists,
    weightsList,
    lcoeList,
    updateFilteredLayer,
    filterRanges,
    presets,
    onAreaEdit,
    onResourceEdit,
    onInputTouched,
    onSelectionChange,
    gridMode,
    setGridMode,
    gridSize, setGridSize,
    maxZoneScore, setMaxZoneScore
    // maxLCOE, setMaxLCOE
  } = props;

  const firstLoad = useRef(true);

  const initListToState = (list, ranges) => {
    return list.map((obj) => ({
      ...obj,
      input: initByType(obj, filterRanges.getData(), apiResourceNameMap[resource]),
      active: obj.active === undefined ? true : obj.active
    }));
  };

  const weightsInd = weightsList.map(w => {
    const [weight, setWeight] = useQsState({
      key: w.id,
      hydrator: v => {
        const base = {
          ...w,
          input: initByType(w, {}),
          active: w.active === undefined ? true : w.active
        };
        let inputUpdate = {};
        if (v) {
          const [value, active] = v.split(',');
          inputUpdate = {
            value: Number(value),
            active: active === undefined
          };
        }
        return {
          ...base,
          active: inputUpdate.active === undefined ? base.active : inputUpdate.active,
          input: {
            ...base.input,
            value: inputUpdate.value || base.input.value
          }
        };
      },
      dehydrator: w => {
        const { value } = w.input;
        let shard = `${value}`;
        shard = w.active ? shard : `${shard},${false}`;
        return shard;
      }
    });
    return [weight, setWeight];
  });

  const filtersInd = filtersLists.map(f => {
    const [filt, setFilt] = useQsState({
      key: f.id,
      default: undefined,
      hydrator: v => {
        const base = {
          ...f,
          input: initByType(f, filterRanges.getData(), apiResourceNameMap[resource]),
          active: f.active === undefined ? true : f.active
        };

        let inputUpdate;
        if (v) {
          if (base.isRange) {
            const [min, max, active] = v.split(',');
            inputUpdate = {
              value: {
                min: Number(min),
                max: Number(max)
              },
              active: active === undefined
            };
          } else if (base.input.options) {
            v = v.split(',');
            let active = true;
            if (v[v.length - 1] === 'false') {
              // remove active
              v = v.slice(0, v.length - 2).map(Number);
              active = false;
            } else {
              v = v.map(Number);
            }
            inputUpdate = {
              value: v,
              active
            };
          } else {
            const [val, active] = v.split(',');
            inputUpdate = {
              value: castByFilterType(base.input.type)(val),
              active: active === undefined
            };
          }

          return {
            ...base,
            active: inputUpdate.active,
            input: {
              ...base.input,
              value: inputUpdate.value || base.input.value
            }
          };
        }
      },
      dehydrator: f => {
        const { value } = f.input;
        let shard;
        if (f.isRange) {
          shard = `${value.min}, ${value.max}`;
        } else if (f.input.options) {
          shard = value.join(',');
        } else {
          shard = `${value}`;
        }
        shard = f.active ? shard : `${shard},${false}`;
        return shard;
      }
    });
    return [filt, setFilt];
  });

  const initializeFilters = () => {
    if (firstLoad.current && filterRanges.isReady()) {
      firstLoad.current = false;
    }
    filtersLists.forEach((filtObject, ind) => {
      const [filt, setFilt] = filtersInd[ind];
      if (filt) {
        // This filter has been set via the url
        // Does not need to be initialized
        return;
      }

      // Initialize the filter with default values
      setFilt({
        ...filtObject,
        input: {
          ...initByType(filtObject, filterRanges.getData(), apiResourceNameMap[resource])
        },
        active: filtObject.active === undefined ? true : filtObject.active
      });
    });
  };

  useEffect(initializeFilters, [filterRanges, resource]);

  const lcoeInd = lcoeList.map(c => {
    const [cost, setCost] = useQsState({
      key: c.id,
      default: undefined,
      hydrator: v => {
        const base = {
          ...c,
          input: initByType(c, {}, apiResourceNameMap[resource]),
          active: c.active === undefined ? true : c.active
        };
        let inputUpdate = {};
        if (v) {
          const [value, active] = v.split(',');
          inputUpdate = {
            value: castByFilterType(base.input.type)(value),
            active: active === undefined
          };
        }
        return {
          ...base,
          active: inputUpdate.active === undefined ? base.active : inputUpdate.active,
          input: {
            ...base.input,
            value: inputUpdate.value || base.input.value
          }
        };
      },
      dehydrator: c => {
        const { value } = c.input;
        let shard = `${value}`;
        shard = c.active ? shard : `${shard},${false}`;
        return shard;
      }
    });
    return [cost, setCost];
  });

  /*
  const [lcoe, setLcoe] = useQsState({
    key: 'lcoe',
    hydrator: v => {
      let base = initListToState(lcoeList);
      if (v) {
        const qsValues = v.split('|').map((vals, i) => {
          const [value, active] = vals.split(',');
          const thisCost = base[i];
          return {
            value: castByFilterType(thisCost.input.type)(value),
            active: active === undefined
          };
        });
        base = base.map((cost, i) => (
          {
            ...cost,
            active: qsValues[i].active,
            input: {
              ...cost.input,
              value: qsValues[i].value || cost.input.value
            }
          }
        ));
      }
      return base;
    },
    dehydrator: v => {
      return v && v.map(w => {
        const { value } = w.input;
        let shard = `${value}`;
        shard = w.active ? shard : `${shard},${false}`;
        return shard;
      }).join('|');
    },
    default: undefined
  });
  */

  // TODO update
  const resetClick = () => {
    // setWeights(initListToState(weightsList));
    // setFilters(initListToState(filtersLists, filterRanges.getData()));
    // setLcoe(initListToState(lcoeList));

    initializeFilters();
  };

  // TODO update this
  const applyClick = () => {
    const weightsValues = Object.values(weights)
      .reduce((accum, weight) => (
        {
          ...accum,
          [weight.id || weight.name]: Number(weight.input.value)
        }), {});

    const lcoeValues = Object.values(lcoe)
      .reduce((accum, cost) => (
        {
          ...accum,
          [cost.id || cost.name]: (cost.input.options ? String : Number)(cost.input.value)
        }), {});
    // TODO fix this
    updateFilteredLayer(filtersInd, weightsValues, lcoeValues);
  };

  // TODO check this
  useEffect(onInputTouched, [area, resource, weightsInd, filtersInd, lcoeInd]);
  useEffect(onSelectionChange, [area, resource, gridSize]);

  useEffect(() => {
    if (resource) {
      try {
        const [capacity, setCapacity] = lcoeInd.find(([cost, _]) => cost.id === 'capacity_factor');
        // const ind = lcoe.findIndex(cost => cost.id === 'capacity_factor');
        capacity.input.availableOptions = capacity.input.options[apiResourceNameMap[resource]];
        capacity.input.value = capacity.input.availableOptions[0];

        // lcoe.splice(ind, 1, capacity);
        // setLcoe(lcoe);
        setCapacity(capacity);
      } catch (err) {
        /* eslint-disable-next-line */
        console.error(err);
      }
    }
  }, [resource]);

  /* Reinitialize filters when new ranges are received */

  /*
  useEffect(() => {
    if (firstLoad.current && filterRanges.isReady()) {
      firstLoad.current = false;
    } else {
      setFilters(initListToState(filtersLists, filterRanges.getData()));
    }
  }, [filterRanges]); */
  if (firstLoad.current) {
    return null;
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
            <Subheading>Grid Size: </Subheading>
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
          name='filters'
          icon='filter'
          presets={presets.filters}
          setPreset={(preset) => {
            if (preset === 'reset') {
              // setFilters(initListToState(filtersLists, filterRanges.getData()));
            } else {
              // setFilters(initListToState(presets.filters[preset], filterRanges.getData()));
            }
          }}
          filters={filtersInd}
          checkIncluded={checkIncluded}
          resource={resource}
          // setFilters={setFilters}
          outputFilters={
            [
              [maxZoneScore, setMaxZoneScore, maxZoneScoreO]
            ]
          }
        />
        <WeightsForm
          name='weights'
          icon='sliders-horizontal'
          weights={weightsInd}
          // setWeights={setWeights}
          presets={presets.weights}
          setPreset={(preset) => {
            if (preset === 'reset') {
              // setWeights(initListToState(weightsList));
            } else {
              // setWeights(initListToState(presets.weights[preset]));
            }
          }}

        />
        <LCOEForm
          name='lcoe'
          icon='disc-dollar'
          lcoe={lcoeInd}
          // setLcoe={setLcoe}
          presets={presets.lcoe}
          setPreset={(preset) => {
            if (preset === 'reset') {
              // TODO
              // setLcoe(initListToState(lcoeList));
            } else {
              // setLcoe(initListToState(presets.lcoe[preset]));
            }
          }}

        />

      </TabbedBlockBody>

      <SubmissionSection>
        <Button
          size='small'
          type='reset'
          onClick={resetClick}
          variation='primary-raised-light'
          useIcon='arrow-loop'
        >
          Reset
        </Button>
        <Button
          size='small'
          type='submit'
          onClick={applyClick}
          variation='primary-raised-dark'
          useIcon='tick--small'
        >
          Apply
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
  presets: T.shape({
    weights: T.object,
    lcoe: T.object,
    filters: T.object
  }),
  onResourceEdit: T.func,
  onAreaEdit: T.func,
  onInputTouched: T.func,
  onSelectionChange: T.func,
  gridMode: T.bool,
  setGridMode: T.func,
  gridSize: T.number,
  setGridSize: T.func,
  maxZoneScore: T.object,
  setMaxZoneScore: T.func
  /* maxLCOE: T.object,
  setMaxLCOE: T.func */
};

export default QueryForm;
