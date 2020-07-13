import React, { useState, useEffect } from 'react';
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

const INIT_GRID_SIZE = 1;
const DEFAULT_RANGE = [0, 100];
const DEFAULT_UNIT = '%';
const ParamTitle = styled.div`
  /* stylelint-disable */
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
const PanelOption = styled.div`
  margin-bottom: 1.5rem;
`;
const WeightsForm = styled.div``;
const FiltersForm = styled.div``;
const LCOEForm = styled.div``;

const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  useIcon: 'pencil',
  hideText: true
})`
  opacity: 50%;
`;

const SelectionOption = styled.li``;

const SelectionList = styled.ol`
  /* stylelint-enable */

  > ${SelectionOption}:hover {
    color: ${themeVal('color.tertiary')};
    background-color: ${themeVal('color.baseAlphaC')};
    cursor: pointer;
  }
`;

const SubmissionSection = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0rem 1rem;
`;

function QueryForm (props) {
  const {
    countryList,
    resourceList,
    weightsList,
    filtersList,
    lcoeList
  } = props;
  const [gridSize, setGridSize] = useState(INIT_GRID_SIZE);

  const initListToState = (list) => {
    return list.map((obj) => ({
      ...obj,
      range: obj.range || DEFAULT_RANGE,
      unit: obj.unit || DEFAULT_UNIT
    }));
  };

  const updateStateList = (list, i, updatedValue) => {
    const updated = list.slice();
    updated[i] = updatedValue;
    return updated;
  };

  const [activeCountry, setActiveCountry] = useState(countryList[0]);
  const [activeResource, setActiveResource] = useState(resourceList[0]);

  const [weights, setWeights] = useState(initListToState(weightsList));
  const [filters, setFilters] = useState(initListToState(filtersList));
  const [lcoe, setLcoe] = useState(lcoeList.map((e) => ({ ...e, value: '' })));

  useEffect(() => {
    setActiveCountry(countryList[0]);
  }, [countryList]);

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
            <Heading size='large' variation='primary'>{activeCountry}</Heading>
            <Dropdown
              alignment='right'
              direction='down'
              triggerElement={<EditButton>Edit Country Selection</EditButton>}
            >
              <SelectionList>
                {countryList.map((country) => (
                  <SelectionOption
                    onClick={() => setActiveCountry(country)}
                    key={country}
                  >
                    {country}
                  </SelectionOption>
                ))}
              </SelectionList>
            </Dropdown>
          </OptionHeadline>
        </HeadOption>

        <HeadOption>
          <Subheading>Resource</Subheading>

          <OptionHeadline>
            <Heading size='large' variation='primary'>{activeResource}</Heading>
            <Dropdown
              alignment='right'
              direction='down'
              triggerElement={<EditButton>Edit Resource Selection</EditButton>}
            >
              <SelectionList>
                {resourceList.map((resource) => (
                  <SelectionOption
                    key={resource}
                    onClick={() => setActiveResource(resource)}
                  >
                    {resource}
                  </SelectionOption>
                ))}
              </SelectionList>
            </Dropdown>
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
        <WeightsForm>
          {weights.map((weight, ind) => (
            <PanelOption key={weight.name}>
              <ParamTitle>{weight.name}</ParamTitle>
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
        </WeightsForm>

        <FiltersForm>
          {filters.map((filter, ind) => (
            <PanelOption key={filter.name}>
              <ParamTitle>{filter.name}</ParamTitle>
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
        </FiltersForm>

        <LCOEForm>
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
        </LCOEForm>
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
  countryList: T.array,
  resourceList: T.array,
  weightsList: T.array,
  filtersList: T.array,
  lcoeList: T.array
};

export default QueryForm;
