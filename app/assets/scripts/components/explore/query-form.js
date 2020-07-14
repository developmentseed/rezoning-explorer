import React, { useState } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { themeVal } from '../../styles/utils/general';
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

const INIT_GRID_SIZE = 1;
const DEFAULT_RANGE = [0, 100];
const DEFAULT_UNIT = '%';

const PanelOption = styled.div`
  margin-bottom: 1.5rem;
`;

const PanelOptionTitle = styled.div`
  opacity: 0.9;
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.bold')};
`;
const HeadOption = styled.div`
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
  padding: 1rem 0;
`;

const OptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FormWrapper = styled.div`
  /* stylelint-disable-next-line */
`;

const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  useIcon: 'pencil',
  hideText: true
})`
  opacity: 50%;
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
    filtersList,
    lcoeList,
    onCountryEdit,
    onResourceEdit
  } = props;
  const [gridSize, setGridSize] = useState(INIT_GRID_SIZE);

  const [weights, setWeights] = useState(initListToState(weightsList));
  const [filters, setFilters] = useState(initListToState(filtersList));
  const [lcoe, setLcoe] = useState(lcoeList.map((e) => ({ ...e, value: '' })));

  const applyClick = () => {
    // handle submission and search
  };

  const resetClick = () => {
    setWeights(initListToState(weightsList));
    setFilters(initListToState(filtersList));
    setLcoe(initListToState(lcoeList));
  };

  return (
    <PanelBlock>
      <PanelBlockHeader>
        <HeadOption>
          <Subheading>Country</Subheading>
          <OptionHeadline>
            <Heading size='large'>{country}</Heading>
            <EditButton onClick={onCountryEdit}>
                Edit Country Selection
            </EditButton>
          </OptionHeadline>
        </HeadOption>

        <HeadOption>
          <Subheading>Resource</Subheading>

          <OptionHeadline>
            <Heading>{resource}</Heading>
            <EditButton onClick={onResourceEdit}>Edit Resource Selection</EditButton>
          </OptionHeadline>
        </HeadOption>

        <HeadOption>
          <Subheading>Grid Size</Subheading>
          <OptionHeadline>
            <Heading>
              {gridSize} km<sup>2</sup>
            </Heading>
            <Dropdown
              alignment='right'
              direction='down'
              triggerElement={<EditButton>Edit Grid Size</EditButton>}
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
          ['Filters', 'compass'],
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
          {filters.map((filter, ind) => (
            <PanelOption key={filter.name}>
              <OptionHeadline>
                <PanelOptionTitle>{filter.name}</PanelOptionTitle>
                <FormSwitch
                  hideText
                  name={`toggle-${filter.name.replace(/ /g, '-')}`}
                  disabled={filter.disabled}
                  checked={filter.active}
                  onChange={() => {
                    setFilters(
                      updateStateList(filters, ind, { ...filter, active: !filter.active })
                    );
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
                onChange={(value) => {
                  setFilters(
                    updateStateList(filters, ind, { ...filter, value })
                  );
                }}
              />

            </PanelOption>
          ))}
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
          size='small'
          onClick={resetClick}
          variation='base-raised-light'
          useIcon='arrow-loop'
        >
          Reset
        </Button>
        <Button
          type='submit'
          size='small'
          onClick={applyClick}
          variation='base-raised-dark'
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
  filtersList: T.array,
  lcoeList: T.array,
  onResourceEdit: T.func,
  onCountryEdit: T.func
};

export default QueryForm;
