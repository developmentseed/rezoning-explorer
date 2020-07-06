import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';

import { FormSelect, FormInput } from '../../styles/form';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockBody,
  PanelBlockScroll,
  PanelBlockFooter
} from '../common/panel-block';
import TabbedBlockBody from '../common/tabbed-block-body';
import Button from '../../styles/button/button';
import SliderGroup from '../common/slider-group';

const FilterTitle = styled.div`
`;

const Filter = styled.div`
`;

const ParamScroll = styled(PanelBlockScroll)`
`;
const WeightsForm = styled.div`
`;
const FiltersForm = styled.div`
`;
const LCOEForm = styled.div`
`;



function FilterForm (props) {
  const { countryList, resourceList, weightsList, filtersList, lcoeList} = props;
  return (
    <PanelBlock>
      <PanelBlockHeader>
        <Filter>
          <FilterTitle>Country</FilterTitle>
          <FormSelect>
            {countryList.map(country => (
              <option key={country} value={country.replace(/ /g, '-')}>{country}</option>
            ))}
          </FormSelect>
        </Filter>

        <Filter>
          <FilterTitle>Resource</FilterTitle>
          <FormSelect>
            {resourceList.map(resource => (
              <option key={resource} value={resource.replace(/ /g, '-')}>{resource}</option>
            ))}

          </FormSelect>
        </Filter>

      </PanelBlockHeader>

      <TabbedBlockBody
        tabContent={[['weights', 'house'], ['filters', 'crosshair'], ['lcoe', 'crosshair']]}
      >
        <WeightsForm>
          {weightsList.map(filter => (
            <Filter key={filter.name}>
              <FilterTitle>{filter.name}</FilterTitle>
              <SliderGroup unit={filter.unit || '%'} range={filter.range || [0, 100]} />
            </Filter>
          ))}
        </WeightsForm>

        <FiltersForm>
          {filtersList.map(filter => (
            <Filter key={filter.name}>
              <FilterTitle>{filter.name}</FilterTitle>
              <SliderGroup unit={filter.unit || '%'} range={filter.range || [0, 100]} />
            </Filter>
          ))}
        </FiltersForm>

        <LCOEForm>
          {lcoeList.map(filter => (
            <Filter key={filter.name}>
              <FilterTitle>{filter.name}</FilterTitle>
              <FormInput />
            </Filter>
          ))}
        </LCOEForm>

      </TabbedBlockBody>


      <PanelBlockFooter>
        <Button>Reset</Button>
        <Button>Apply</Button>

      </PanelBlockFooter>

    </PanelBlock>

  );
}
FilterForm.propTypes = {
  countryList: T.array,
  resourceList: T.array,
  weightsList: T.array
};

export default FilterForm;
