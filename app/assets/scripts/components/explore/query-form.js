import React, { useRef, useEffect, useState } from 'react';
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
import { INPUT_CONSTANTS, checkIncluded, apiResourceNameMap, setRangeByUnit } from './panel-data';
import FormSelect from '../../styles/form/select';
import { FormGroup } from '../../styles/form/group';
import { HeadOption, HeadOptionHeadline } from './form/form';
import { FiltersForm, WeightsForm, LCOEForm } from './form';
import ShadowScrollbar from '../common/shadow-scrollbar';

const { SLIDER, BOOL, DROPDOWN, MULTI, TEXT, GRID_OPTIONS, DEFAULT_RANGE } = INPUT_CONSTANTS;

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
  // Api filter schema includes layer property
  // Use to resolve correct range from api /filter/{country}/layers
  const apiRange = ranges[obj.layer];
  const { input, options } = obj;

  const range = setRangeByUnit(
    (apiRange &&
      [round(apiRange.min), round(apiRange.max)]) ||
      obj.input.range || DEFAULT_RANGE,
    obj.unit);

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

const updateStateList = (list, i, updatedValue) => {
  const updated = list.slice();
  updated[i] = updatedValue;
  return updated;
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
    presets: defaultPresets,
    onAreaEdit,
    onResourceEdit,
    onInputTouched,
    onSelectionChange,
    gridMode,
    setGridMode,
    gridSize, setGridSize,
    maxZoneScore, setMaxZoneScore,
    maxLCOE, setMaxLCOE
  } = props;

  const firstLoad = useRef(true);
  const [presets, setPresets] = useState(defaultPresets);

  const initListToState = (list, ranges) => {
    return list.map((obj) => ({
      ...obj,
      input: initByType(obj, ranges || {}, apiResourceNameMap[resource]),
      active: obj.active === undefined ? true : obj.active
    }));
  };

  const [weights, setWeights] = useQsState({
    key: 'weights',
    hydrator: v => {
      let base = initListToState(weightsList);
      if (v) {
        const qsValues = v.split('|').map(vals => {
          const [value, active] = vals.split(',');
          return {
            value: Number(value),
            active: active === undefined
          };
        });
        base = base.map((weight, i) => (
          {
            ...weight,
            active: qsValues[i].active,
            input: {
              ...weight.input,
              value: qsValues[i].value || weight.input.value
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

  const [filters, setFilters] = useQsState({
    key: 'filters',
    hydrator: v => {
      let baseFilts = initListToState(filtersLists, filterRanges.getData());
      if (v) {
        const qsValues = v.split('|').map((vals, i) => {
          const thisFilt = baseFilts[i];
          if (thisFilt.isRange) {
            const [min, max, active] = vals.split(',');
            return {
              value: {
                min: Number(min),
                max: Number(max)
              },
              active: active === undefined
            };
          } else if (thisFilt.input.options) {
            // multi select or dropdown
            vals = vals.split(',');
            let active = true;
            if (vals[vals.length - 1] === 'false') {
              // remove active
              vals = vals.slice(0, vals.length - 2).map(Number);
              active = false;
            } else {
              vals = vals.map(Number);
            }
            return {
              value: vals,
              active
            };
          } else {
            const [val, active] = vals.split(',');
            return {
              value: castByFilterType(thisFilt.input.type)(val),
              active: active === undefined
            };
          }
        });

        baseFilts = baseFilts.map((filt, i) => (
          {
            ...filt,
            active: qsValues[i].active,
            input: {
              ...filt.input,
              value: qsValues[i].value || filt.input.value
            }
          }
        ));
      }
      return baseFilts;
    },
    dehydrator: v => {
      return v && v.map(f => {
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
      }).filter(f => !f.excluded)
        .join('|');
    },
    default: undefined
  });

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

  const inputOfType = (option, onChange) => {
    const { range, value } = option.input;
    let errorMessage;
    if (range) {
      errorMessage = range[1] - range[0] === 0 ? `Allowed value is ${range[0]}` : `Allowed range is ${round(range[0])} - ${round(range[1])}`;
    } else {
      errorMessage = 'Value not accepted';
    }

    switch (option.input.type) {
      case SLIDER:
        return (
          <SliderGroup
            range={range}
            id={option.name}
            value={option.input.value}
            isRange={option.isRange}
            disabled={!option.active}
            onChange={onChange}
          />
        );
      case TEXT:
        return (
          <StressedFormGroupInput
            inputType='number'
            inputSize='small'
            disabled={option.readOnly}
            id={`${option.name}`}
            name={`${option.name}`}
            value={option.input.value}
            validate={option.input.range ? validateRangeNum(option.input.range[0], option.input.range[1]) : () => true}
            errorMessage={errorMessage}
            onChange={onChange}
            validationTimeout={1500}
          />
        );
      case BOOL:
        return null;
      case MULTI:
        return (
          <Dropdown
            triggerElement={
              <MultiSelectButton
                disabled={!option.active}
              > {
                  option.input.options.filter((e, i) => value.includes(i)).join(',')
                }
              </MultiSelectButton>
            }
            alignment='right'
          >
            <MultiWrapper>
              {
                option.input.options.map((o, i) => (
                  <FormCheckable
                    key={o}
                    name={o}
                    id={o}
                    type='checkbox'
                    checked={value.includes(i)}
                    onChange={() => {
                      if (value.includes(i)) {
                        value.splice(value.indexOf(i), 1);
                        onChange(value);
                      } else {
                        onChange([...value, i]);
                      }
                    }}
                  >{o}
                  </FormCheckable>
                ))
              }
            </MultiWrapper>
          </Dropdown>
        );
      case DROPDOWN:
        return (
          <FormGroup>
            <FormSelect
              id={option.name}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              value={option.input.value}
            >
              {
                option.input.availableOptions.map(o => {
                  return (
                    <option
                      value={o}
                      key={o}
                    >
                      {o}
                    </option>
                  );
                })
              }
            </FormSelect>
          </FormGroup>
        );
      default:
        return null;
    }
  };

  const resetClick = () => {
    setWeights(initListToState(weightsList));
    setFilters(initListToState(filtersLists, filterRanges.getData()));
    setLcoe(initListToState(lcoeList));
  };

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
    updateFilteredLayer(filters, weightsValues, lcoeValues);
  };

  useEffect(onInputTouched, [area, resource, weights, filters, lcoe]);
  useEffect(onSelectionChange, [area, resource, gridSize]);

  useEffect(() => {
    if (resource) {
      try {
        const capacity = lcoe.find(cost => cost.id === 'capacity_factor');
        const ind = lcoe.findIndex(cost => cost.id === 'capacity_factor');
        capacity.input.availableOptions = capacity.input.options[apiResourceNameMap[resource]];
        capacity.input.value = capacity.input.availableOptions[0];
        capacity.input.default = capacity.input.availableOptions[0];

        lcoe.splice(ind, 1, capacity);
        setLcoe(lcoe);

        Object.keys(presets.lcoe)
          .forEach(pre => {
            presets.lcoe[pre] = presets.lcoe[pre].map(cost => {
              if (cost.id === 'capacity_factor') {
                return capacity;
              } else {
                return cost;
              }
            });
          });
        setPresets(presets);
      } catch (err) {
        /* eslint-disable-next-line */
        console.error(err);
      }
    }
  }, [resource]);
  /*
  useEffect(() => {
    if (filterRanges.isReady()) {
      try {
        const capfac = lcoe.find(f => f.id === 'capacity_factor').input.value;
        const range = filterRanges.getData().f_lcoe[capfac].total;
        setMaxLCOEO({
          ...maxLCOEO,
          active: true,
          input: {
            ...maxLCOEO.input,
            range: [range.min, range.max]
          }
        });

        setMaxLCOE(range);
      } catch (err) {
        setMaxLCOEO({
          ...maxLCOEO,
          active: false
        });
        setMaxLCOE(null);
        console.warn('LCOE Filter not available for this country');
      }
    }
  }, [lcoe.find(f => f.id === 'capacity_factor').input.value, filterRanges]);
*/

  /* Reinitialize filters when new ranges are received */

  useEffect(() => {
    if (firstLoad.current && filterRanges.isReady()) {
      firstLoad.current = false;
    } else {
      setFilters(initListToState(filtersLists, filterRanges.getData()));
    }
  }, [filterRanges]);

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
          setPreset={(preset) => {
            if (preset === 'reset') {
              setFilters(initListToState(filtersLists, filterRanges.getData()));
            } else {
              setFilters(initListToState(presets.filters[preset], filterRanges.getData()));
            }
          }}
          filters={filters}
          inputOfType={inputOfType}
          checkIncluded={checkIncluded}
          resource={resource}
          setFilters={setFilters}
          updateStateList={updateStateList}
          outputFilters={
            [
              [maxZoneScore, setMaxZoneScore, 'Run analysis to filter on zone score'],
              [maxLCOE, setMaxLCOE, 'Run analysis to filter on LCOE']
            ]
          }
        />
        <WeightsForm
          name='weights'
          icon='sliders-horizontal'
          weights={weights}
          setWeights={setWeights}
          inputOfType={inputOfType}
          updateStateList={updateStateList}
          setPreset={(preset) => {
            if (preset === 'reset') {
              setWeights(initListToState(weightsList));
            } else {
              setWeights(initListToState(presets.weights[preset]));
            }
          }}

        />
        <LCOEForm
          name='lcoe'
          icon='disc-dollar'
          lcoe={lcoe}
          setLcoe={setLcoe}
          inputOfType={inputOfType}
          updateStateList={updateStateList}
          presets={presets.lcoe}
          setPreset={(preset) => {
            if (preset === 'reset') {
              setLcoe(initListToState(lcoeList));
            } else {
              setLcoe(presets.lcoe[preset]);
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
  setMaxZoneScore: T.func,
  maxLCOE: T.object,
  setMaxLCOE: T.func
};

export default QueryForm;
