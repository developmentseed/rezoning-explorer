import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Form, FormSelect } from '../../styles/form';
import SliderGroup from '../common/slider-group';

const FilterTitle = styled.div`
`;

const Filter = styled.div`
`;

function FilterForm (props) {
  const { countryList, resourceList, filterList } = props;
  return (
    <Form>
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

      {filterList.map(filter => (
        <Filter key={filter.name}>
          <FilterTitle>{filter.name}</FilterTitle>
          <SliderGroup unit={filter.unit || '%'} range={filter.range || [0,100]} />
        </Filter>
      ))}

    </Form>

  );
}
FilterForm.propTypes = {
  countryList: T.array,
  resourceList: T.array,
  filterList: T.array
};

export default FilterForm;
