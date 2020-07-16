import React, { useState } from 'react';
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
import Dropdown from '../common/dropdown';
import StressedFormGroupInput from '../common/stressed-form-group-input';
import Heading, { Subheading } from '../../styles/type/heading';
import { FormSwitch } from '../../styles/form/switch';
import { glsp } from '../../styles/utils/theme-values';
import collecticon from '../../styles/collecticons';

import { Accordion, AccordionFold } from '../../components/accordion';

const INIT_GRID_SIZE = 1;
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
  padding: 0.5rem 0;
  &:last-of-type {
    box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
  }
`;

const OptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & >:first-child {
    min-width: 5rem;
  }
`;

const FormWrapper = styled.section`
  ${({ active }) => {
    if (!active) { return 'display: none;'; }
  }
  }
`;

const FormGroupWrapper = styled.div`
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
  padding: 1rem 0;

  &:first-of-type {
    padding-top: 0;
  }
`;

const EditButton = styled(Button).attrs({
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

/*
const SelectionOption = styled.li``;
const SelectionList = styled.ol`
  > ${SelectionOption}:hover {
    color: ${themeVal('color.tertiary')};
    background-color: ${themeVal('color.baseAlphaC')};
    cursor: pointer;
  }
`;
*/

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
    active: true
  }));
};

const initObjectToState = (obj) => {
  return Object.keys(obj).reduce((accum, key) => {
    return ({
      ...accum,
      [key]: initListToState(obj[key])
    });
  }, {});
};

const updateStateList = (list, i, updatedValue) => {
  const updated = list.slice();
  updated[i] = updatedValue;
  return updated;
};

function QueryForm (props) {
  const {
    country,
    resource,
    weightsList,
    filtersLists,
    lcoeList,
    onCountryEdit,
    onResourceEdit
  } = props;
  const [gridSize, setGridSize] = useState(INIT_GRID_SIZE);

  const [weights, setWeights] = useState(initListToState(weightsList));
  const [filters, setFilters] = useState(initObjectToState(filtersLists));
  const [lcoe, setLcoe] = useState(lcoeList.map((e) => ({ ...e, value: '' })));

  const applyClick = () => {
    // handle submission and search
  };

  const resetClick = () => {
    setWeights(initListToState(weightsList));
    setFilters(initObjectToState(filtersLists));
    setLcoe(initListToState(lcoeList));
  };

  return (
    <PanelBlock>
      <PanelBlockHeader>
        <HeadOption>
          <OptionHeadline>
            <Heading size='large' variation='primary'>{country || 'Select Country'}</Heading>
            <EditButton onClick={onCountryEdit} title='Edit Country'>
                Edit Country Selection
            </EditButton>
          </OptionHeadline>
        </HeadOption>

        <HeadOption>
          <OptionHeadline>
            <Subheading>Resource:  </Subheading>
            <Subheading variation='primary'><strong>{resource || 'Select Resource'}</strong></Subheading>
            <EditButton onClick={onResourceEdit} title='Edit Resource'>Edit Resource Selection</EditButton>
          </OptionHeadline>
        </HeadOption>

        <HeadOption>
          <OptionHeadline>
            <Subheading>Grid Size:  </Subheading>
            <Subheading variation='primary'>
              <strong>{gridSize} km<sup>2</sup></strong>
            </Subheading>
            <Dropdown
              alignment='right'
              direction='down'
              triggerElement={<EditButton title='Edit Grid Size'>Edit Grid Size</EditButton>}
            >
              <SliderGroup
                unit='km^2'
                range={[1, 24]}
                value={gridSize}
                onChange={(v) => setGridSize(v)}
              />
            </Dropdown>
          </OptionHeadline>
        </HeadOption>
      </PanelBlockHeader>

      <TabbedBlockBody
        tabContent={[
          ['Weights', 'sliders-horizontal'],
          ['Filters', 'filter'],
          ['LCOE', 'disc-dollar']
        ]}
      >
        <FormWrapper>
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

        <FormWrapper>

          <Accordion
            initialState={[true, ...Object.keys(filters).slice(1).map(_ => false)]}
          >
            {({ checkExpanded, setExpanded }) => (
              Object.entries(filters)
                .map(([group, list], idx) => {
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
                      renderBody={({ isFoldExpanded }) => (
                        list.map((filter, ind) => (
                          <PanelOption key={filter.name} hidden={!isFoldExpanded}>
                            <OptionHeadline>
                              <PanelOptionTitle>{filter.name}</PanelOptionTitle>
                              <FormSwitch
                                hideText
                                name={`toggle-${filter.name.replace(/ /g, '-')}`}
                                disabled={filter.disabled}
                                checked={filter.active}
                                onChange={() => {
                                  setFilters({
                                    ...filters,
                                    [group]: updateStateList(list, ind, { ...filter, active: !filter.active })
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
                              value={
                                filter.value === undefined ? filter.range[0] : filter.value
                              }
                              disabled={!filter.active}
                              onChange={(value) => {
                                if (filter.active) {
                                  setFilters({
                                    ...filters,
                                    [group]: updateStateList(list, ind, { ...filter, value })
                                  });
                                }
                              }}
                            />
                          </PanelOption>
                        )))}
                    />);
                })
            )}
          </Accordion>
        </FormWrapper>

        <FormWrapper>
          {lcoe.map((filter, ind) => (
            <PanelOption key={filter.name}>
              <StressedFormGroupInput
                inputType='number'
                inputSize='small'
                id={`${filter.name}`}
                name={`${filter.name}`}
                label={filter.name}
                value={filter.value || ''}
                validate={() => true}
                onChange={(v) => {
                  setLcoe(updateStateList(lcoe, ind, { ...filter, value: v }));
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
QueryForm.propTypes = {
  country: T.string,
  resource: T.string,
  weightsList: T.array,
  filtersLists: T.object,
  lcoeList: T.array,
  onResourceEdit: T.func,
  onCountryEdit: T.func
};

export default QueryForm;
