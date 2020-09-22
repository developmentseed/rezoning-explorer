import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { themeVal, makeTitleCase } from '../../styles/utils/general';
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

const GRID_OPTIONS = [9, 25, 50];
const DEFAULT_RANGE = [0, 100];
const DEFAULT_UNIT = '%';

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

const initListToState = (list) => {
  return list.map((obj) => ({
    ...obj,
    range: obj.range || DEFAULT_RANGE,
    unit: obj.unit || DEFAULT_UNIT,
    active: obj.active === undefined ? true : obj.active,
    value: obj.value || obj.default || (obj.isRange ? { min: obj.range[0], max: obj.range[1] } : (obj.range || DEFAULT_RANGE)[0])
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
    gridMode, setGridMode
  } = props;
  const [gridSize, setGridSize] = useState(GRID_OPTIONS[0]);
  // const [gridMode, setGridMode] = useState(true);

  const [weights, setWeights] = useState(initListToState(weightsList));
  const [filters, setFilters] = useState(initObjectToState(filtersLists));
  const [lcoe, setLcoe] = useState(initListToState(lcoeList));

  const resetClick = () => {
    setWeights(initListToState(weightsList));
    setFilters(initObjectToState(filtersLists));
    setLcoe(initListToState(lcoeList));
  };

  const applyClick = () => {
    const filterValues = Object.values(filters)
      .reduce((accum, section) => [...accum,
        ...section.map(filter => filter.value)], []);
    const weightsValues = Object.values(weights)
      .reduce((accum, weight) => (
        {
          ...accum,
          [weight.id || weight.name]: Number(weight.value)
        }), {});

    const lcoeValues = Object.values(lcoe)
      .reduce((accum, weight) => (
        {
          ...accum,
          [weight.id || weight.name]: Number(weight.value)
        }), {});
    updateFilteredLayer(filterValues, weightsValues, lcoeValues);
  };

  useEffect(onInputTouched, [area, resource, weights, filters, lcoe]);
  useEffect(onSelectionChange, [area, resource, gridSize]);

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

                          <SliderGroup
                            unit={filter.unit || '%'}
                            range={filter.range || [0, 100]}
                            id={filter.name}
                            value={filter.value}
                            isRange
                            disabled={!filter.active}
                            onChange={(value) => {
                              if (filter.active) {
                                setFilters({
                                  ...filters,
                                  [group]: updateStateList(list, ind, {
                                    ...filter,
                                    value
                                  })
                                });
                              }
                            }}
                          />
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
              <SliderGroup
                unit={weight.unit || '%'}
                range={weight.range || [0, 100]}
                id={weight.name}
                value={
                  weight.value === undefined ? weight.range[0] : weight.value
                }
                onChange={(value) => {
                  setWeights(
                    updateStateList(weights, ind, { ...weight, value })
                  );
                }}
              />
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
              <StressedFormGroupInput
                inputType='number'
                inputSize='small'
                id={`${cost.name}`}
                name={`${cost.name}`}
                label={cost.name}
                value={cost.value || cost.range[0]}
                validate={cost.range ? validateRangeNum(cost.range[0], cost.range[1]) : () => true}
                onChange={(v) => {
                  setLcoe(updateStateList(lcoe, ind, { ...cost, value: v }));
                }}
              />
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
  onSelectionChange: T.func
};

export default QueryForm;
