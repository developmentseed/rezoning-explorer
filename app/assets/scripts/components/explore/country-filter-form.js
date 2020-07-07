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

const ParamTitle = styled.div`
/* stylelint-disable */
`;
const HeadOption = styled.div`
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
`;
const OptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
`;
const PanelOption = styled.div`
`;
const WeightsForm = styled.div`
`;
const FiltersForm = styled.div`
`;
const LCOEForm = styled.div`
`;

const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  useIcon: 'pencil',
  hideText: true
})``;

const SelectionList = styled.ol`
/* stylelint-enable */
`;

const SubmissionSection = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0rem 1rem;

`;

function ParamForm (props) {
  const { countryList, resourceList, weightsList, filtersList, lcoeList } = props;
  const [gridSize, setGridSize] = useState(1);

  const initListToState = list => {
    return list.map(obj => ({ ...obj, range: obj.range || [0, 100], unit: obj.unit || '%' }));
  };

  const updateStateList = (list, i, updatedValue) => {
    const updated = list.slice();
    updated[i] = updatedValue;
    return updated;
  };

  const [weights, setWeights] = useState(initListToState(weightsList));
  const [filters, setFilters] = useState(initListToState(filtersList));
  const [lcoe, setLcoe] = useState(lcoeList.map(e => ({ ...e, value: '' })));

  return (
    <PanelBlock>
      <PanelBlockHeader>
        <HeadOption>
          <Subheading>Country</Subheading>
          <OptionHeadline>
            <Heading>Zambia</Heading>
            <Dropdown
              alignment='right'
              direction='down'
              triggerElement={
                <EditButton>
                Edit Country Selection
                </EditButton>
              }
            >
              <SelectionList>
                {countryList.map(country => (
                  <li key={country} value={country.replace(/ /g, '-')}>{country}</li>
                ))}
              </SelectionList>
            </Dropdown>
          </OptionHeadline>
        </HeadOption>

        <HeadOption>
          <Subheading>Resource</Subheading>

          <OptionHeadline>
            <Heading>Resource</Heading>
            <Dropdown
              alignment='right'
              direction='down'
              triggerElement={
                <EditButton>
                Edit Country Selection
                </EditButton>
              }
            >
              <SelectionList>
                {resourceList.map(resource => (
                  <li key={resource} value={resource.replace(/ /g, '-')}>{resource}</li>
                ))}
              </SelectionList>
            </Dropdown>
          </OptionHeadline>
        </HeadOption>

        <HeadOption>
          <Subheading>Grid Size</Subheading>
          <OptionHeadline>
            <Heading>{gridSize} km<sup>2</sup></Heading>
            <Dropdown
              alignment='right'
              direction='down'
              triggerElement={
                <EditButton>
                Edit Grid Size
                </EditButton>
              }
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
        tabContent={[['Weights', 'house'], ['Filters', 'crosshair'], ['LCOE', 'crosshair']]}
      >
        <WeightsForm>
          {weights.map((weight, ind) => (
            <PanelOption key={weight.name}>
              <ParamTitle>{weight.name}</ParamTitle>
              <SliderGroup
                unit={weight.unit || '%'}
                range={weight.range || [0, 100]}
                id={weight.name}
                value={weight.value === undefined ? weight.range[0] : weight.value}
                onChange={value => {
                  setWeights(updateStateList(weights, ind, { ...weight, value }));
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
                value={filter.value === undefined ? filter.range[0] : filter.value}
                onChange={value => {
                  setFilters(updateStateList(filters, ind, { ...filter, value }));
                }}
              />
            </PanelOption>
          ))}
        </FiltersForm>

        <LCOEForm>
          {lcoe.map((filter, ind) => (
            <PanelOption key={filter.name}>
              <StressedFormGroupInput
                inputType='text'
                inputSize='small'
                id={`${filter.name}`}
                name={`${filter.name}`}
                label={filter.name}
                value={filter.value}
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
        <Button>Reset</Button>
        <Button>Apply</Button>
      </SubmissionSection>

    </PanelBlock>

  );
}
ParamForm.propTypes = {
  countryList: T.array,
  resourceList: T.array,
  weightsList: T.array,
  filtersList: T.array,
  lcoeList: T.array
};

export default ParamForm;
