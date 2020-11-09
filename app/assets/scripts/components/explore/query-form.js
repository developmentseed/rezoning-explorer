import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { themeVal, makeTitleCase } from '../../styles/utils/general';
import useQsState from '../../utils/qs-state-hook';

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
import { FormSwitch } from '../../styles/form/switch';
import { glsp } from '../../styles/utils/theme-values';
import collecticon from '../../styles/collecticons';
import { validateRangeNum } from '../../utils/utils';

import { Accordion, AccordionFold } from '../../components/accordion';
import InfoButton from '../common/info-button';
import GridSetter from './grid-setter';

import ExploreContext from '../../context/explore-context';
import { INPUT_CONSTANTS } from './panel-data';

const turbineTypeMap = {
  'Off-Shore Wind': [1, 3],
  Wind: [1, 3],
  'Solar PV': [0, 0]
};

const { SLIDER, BOOL, MULTI, TEXT, GRID_OPTIONS, DEFAULT_UNIT, DEFAULT_RANGE } = INPUT_CONSTANTS;
const PanelOption = styled.div`
  ${({ hidden }) => hidden && 'display: none;'}
  margin-bottom: 1.5rem;
`;

const PanelOptionTitle = styled.div`
  font-weight: ${themeVal('type.base.weight')};
`;
const HeadOption = styled.div`
  & ~ & {
    padding-top: ${glsp(0.5)};
  }
  &:last-of-type {
    box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
    padding-bottom: ${glsp(0.5)};
  }
`;

const HeadOptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > :first-child {
    min-width: 5rem;
  }
`;

const Subheadingstrong = styled.strong`
  color: ${themeVal('color.base')};
`;

const OptionHeadline = styled(HeadOptionHeadline)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  > ${FormSwitch} {
    grid-column-start: 5;
  }
  > ${Button}.info-button {
    grid-column-start: 4;
  }
`;

const FormWrapper = styled.section`
  ${({ active }) => {
    if (!active) {
      return 'display: none;';
    }
  }}
`;

const FormGroupWrapper = styled.div`
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
  padding: 1rem 0;

  &:first-of-type {
    padding-top: 0;
  }
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

export const AccordionFoldTrigger = styled.a`
  display: flex;
  align-items: center;
  margin: -${glsp(0.5)} -${glsp()};
  padding: ${glsp(0.5)} ${glsp()};

  &,
  &:visited {
    color: inherit;
  }
  &:active {
    transform: none;
  }
  &:after {
    ${collecticon('chevron-down--small')}
    margin-left: auto;
    transition: transform 240ms ease-in-out;
    transform: ${({ isExpanded }) =>
      isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const SubmissionSection = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0rem 1rem;
`;

const initByType = obj => {
  switch (obj.type) {
    case SLIDER:
      return {
        ...obj,
        range: obj.range || DEFAULT_RANGE,
        unit: obj.unit || DEFAULT_UNIT,
        value: obj.value || obj.default || (obj.isRange ? { min: obj.range[0], max: obj.range[1] } : (obj.range || DEFAULT_RANGE)[0])
      };
    case TEXT:
      return {
        ...obj,
        range: obj.range || DEFAULT_RANGE,
        unit: obj.unit || DEFAULT_UNIT,
        value: obj.value || obj.default || (obj.range || DEFAULT_RANGE)[0]
      };
    case BOOL:
    case MULTI:
    default:
      return {};
  }
};

const initListToState = (list) => {
  return list.map((obj) => ({
    ...obj,
    input: initByType(obj.input),

    // range: obj.range || DEFAULT_RANGE,
    // unit: obj.unit || DEFAULT_UNIT,
    active: obj.active === undefined ? true : obj.active
    // value: obj.value || obj.default || (obj.isRange ? { min: obj.range[0], max: obj.range[1] } : (obj.range || DEFAULT_RANGE)[0])
  }));
};

const initObjectToState = (obj) => {
  return Object.keys(obj).reduce((accum, key) => {
    return {
      ...accum,
      [key]: initListToState(obj[key])
    };
  }, {});
};

const updateStateList = (list, i, updatedValue) => {
  const updated = list.slice();
  updated[i] = updatedValue;
  return updated;
};

function QueryForm (props) {
  const { updateFilteredLayer } = useContext(ExploreContext);

  const {
    area,
    resource,
    weightsList,
    filtersLists,
    lcoeList,
    presets,
    onAreaEdit,
    onResourceEdit,
    onInputTouched,
    onSelectionChange,
    gridMode,
    setGridMode,
    gridSize, setGridSize
  } = props;

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
      const baseFilts = initObjectToState(filtersLists);
      if (v) {
        const qsValues = v.split('|').map(vals => {
          const [min, max, active] = vals.split(',');
          return {
            value: {
              min: Number(min),
              max: Number(max)
            },
            active: active === undefined
          };
        });
        baseFilts.distance_filters = baseFilts.distance_filters.map((filt, i) => (
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
      return v && v.distance_filters.map(f => {
        const { value } = f.input;
        let shard = `${value.min}, ${value.max}`;
        shard = f.active ? shard : `${shard},${false}`;
        return shard;
      }).join('|');
    },
    default: undefined
  });

  const [lcoe, setLcoe] = useQsState({
    key: 'lcoe',
    hydrator: v => {
      let base = initListToState(lcoeList);
      if (v) {
        const qsValues = v.split('|').map(vals => {
          const [value, active] = vals.split(',');
          return {
            value: Number(value),
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
    const { range } = option.input;
    const errorMessage = range[1] - range[0] === 0 ? `Allowed value is ${range[0]}` : `Allowed range is ${range[0]} - ${range[1]}`;

    switch (option.input.type) {
      case SLIDER:
        return (
          <SliderGroup
            unit={option.input.unit || '%'}
            range={option.input.range || [0, 100]}
            id={option.name}
            value={option.input.value}
            isRange={option.input.isRange}
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
            label={option.name}
            value={option.input.value}
            validate={option.input.range ? validateRangeNum(option.input.range[0], option.input.range[1]) : () => true}
            errorMessage={errorMessage}
            onChange={onChange}
            validationTimeout={1500}
          />
        );
      case BOOL:
      case MULTI:
      default:
        return {};
    }
  };

  const resetClick = () => {
    setWeights(initListToState(weightsList));
    setFilters(initObjectToState(filtersLists));
    setLcoe(initListToState(lcoeList));
  };

  const applyClick = () => {
    const filterValues = Object.values(filters)
      .reduce((accum, section) => [...accum,
        ...section.map(filter => filter.input.value)], []);
    const weightsValues = Object.values(weights)
      .reduce((accum, weight) => (
        {
          ...accum,
          [weight.id || weight.name]: Number(weight.input.value)
        }), {});

    const lcoeValues = Object.values(lcoe)
      .reduce((accum, weight) => (
        {
          ...accum,
          [weight.id || weight.name]: Number(weight.input.value)
        }), {});
    updateFilteredLayer(filterValues, weightsValues, lcoeValues);
  };

  useEffect(onInputTouched, [area, resource, weights, filters, lcoe]);
  useEffect(onSelectionChange, [area, resource, gridSize]);

  useEffect(() => {
    if (resource) {
      const turbineType = lcoe.find(cost => cost.id === 'turbine_type');
      turbineType.input.range = turbineTypeMap[resource];
      turbineType.input.value = turbineType.input.range[0];
    }
  }, [resource]);

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
        <FormWrapper
          name='filters'
          icon='filter'
          presets={presets.filters}
          setPreset={(preset) => {
            if (preset === 'reset') {
              setFilters(initObjectToState(filtersLists));
            } else {
              setFilters(initObjectToState(presets.filters[preset]));
            }
          }}
        >
          <Accordion
            initialState={[
              true,
              ...Object.keys(filters)
                .slice(1)
                .map((_) => false)
            ]}
          >
            {({ checkExpanded, setExpanded }) =>
              Object.entries(filters).map(([group, list], idx) => {
                return (
                  <AccordionFold
                    key={group}
                    forwardedAs={FormGroupWrapper}
                    isFoldExpanded={checkExpanded(idx)}
                    setFoldExpanded={(v) => setExpanded(idx, v)}
                    renderHeader={({ isFoldExpanded, setFoldExpanded }) => (
                      <AccordionFoldTrigger
                        isExpanded={isFoldExpanded}
                        onClick={() => setFoldExpanded(!isFoldExpanded)}
                      >
                        <Heading size='medium' variation='primary'>
                          {makeTitleCase(group.replace(/_/g, ' '))}
                        </Heading>
                      </AccordionFoldTrigger>
                    )}
                    renderBody={({ isFoldExpanded }) =>
                      list.map((filter, ind) => (
                        <PanelOption key={filter.name} hidden={!isFoldExpanded}>
                          <OptionHeadline>
                            <PanelOptionTitle>{filter.name}</PanelOptionTitle>
                            {filter.info && (
                              <InfoButton info={filter.info} id={filter.name}>
                                Info
                              </InfoButton>
                            )}
                            <FormSwitch
                              hideText
                              name={`toggle-${filter.name.replace(/ /g, '-')}`}
                              disabled={filter.disabled}
                              checked={filter.active}
                              onChange={() => {
                                setFilters({
                                  ...filters,
                                  [group]: updateStateList(list, ind, {
                                    ...filter,
                                    active: !filter.active
                                  })
                                });
                              }}
                            >
                              Toggle filter
                            </FormSwitch>
                          </OptionHeadline>
                          {
                            inputOfType(filter, (value) => {
                              if (filter.active) {
                                setFilters({
                                  ...filters,
                                  [group]: updateStateList(list, ind, {
                                    ...filter,
                                    input: {
                                      ...filter.input,
                                      value
                                    }
                                  })
                                });
                              }
                            })
                          }

                        </PanelOption>
                      ))}
                  />
                );
              })}
          </Accordion>
        </FormWrapper>

        <FormWrapper
          name='weights'
          icon='sliders-horizontal'
          presets={presets.weights}
          setPreset={(preset) => {
            if (preset === 'reset') {
              setWeights(initListToState(weightsList));
            } else {
              setWeights(initListToState(presets.weights[preset]));
            }
          }}
        >
          {weights.map((weight, ind) => (
            <PanelOption key={weight.name}>
              <PanelOptionTitle>{weight.name}</PanelOptionTitle>
              {
                inputOfType(weight, (value) => {
                  setWeights(
                    updateStateList(weights, ind, {
                      ...weight,
                      input: {
                        ...weight.input,
                        value
                      }
                    })
                  );
                })
              }
            </PanelOption>
          ))}
        </FormWrapper>

        <FormWrapper
          name='lcoe'
          icon='disc-dollar'
          presets={presets.lcoe}
          setPreset={(preset) => {
            if (preset === 'reset') {
              setLcoe(initListToState(lcoeList));
            } else {
              setLcoe(initListToState(presets.lcoe[preset]));
            }
          }}
        >
          {lcoe.map((cost, ind) => (
            <PanelOption key={cost.name}>
              {
                inputOfType(cost, (v) => {
                  setLcoe(updateStateList(lcoe, ind, {
                    ...cost,
                    input: {
                      ...cost.input,
                      value: v
                    }
                  }));
                })
              }
            </PanelOption>
          ))}
        </FormWrapper>
      </TabbedBlockBody>

      <SubmissionSection>
        <Button
          type='reset'
          onClick={resetClick}
          variation='base-raised-light'
          useIcon='arrow-loop'
        >
          Reset
        </Button>
        <Button
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

FormWrapper.propTypes = {
  setPreset: T.func.isRequired,
  presets: T.oneOfType([T.object, T.array]).isRequired,
  name: T.string,
  icon: T.string
};

QueryForm.propTypes = {
  area: T.object,
  resource: T.string,
  weightsList: T.array,
  filtersLists: T.object,
  lcoeList: T.array,
  onResourceEdit: T.func,
  onAreaEdit: T.func,
  presets: T.object,
  onInputTouched: T.func,
  onSelectionChange: T.func,
  gridMode: T.bool,
  setGridMode: T.func,
  gridSize: T.number,
  setGridSize: T.func
};

export default QueryForm;
