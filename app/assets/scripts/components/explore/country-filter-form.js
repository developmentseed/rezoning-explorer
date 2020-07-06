import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';

import { FormSelect } from '../../styles/form';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockBody,
  PanelBlockScroll,
  PanelBlockFooter
} from '../common/panel-block';
import Button from '../../styles/button/button';
import SliderGroup from '../common/slider-group';

const FilterTitle = styled.div`
`;

const Filter = styled.div`
`;

const ParamScroll = styled(PanelBlockScroll)`
`;

function FilterForm (props) {
  const { countryList, resourceList, filterList } = props;
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
      <PanelBlockBody>
        <ParamScroll>
          {filterList.map(filter => (
            <Filter key={filter.name}>
              <FilterTitle>{filter.name}</FilterTitle>
              <SliderGroup unit={filter.unit || '%'} range={filter.range || [0, 100]} />
            </Filter>
          ))}
        </ParamScroll>
      </PanelBlockBody>

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
  filterList: T.array
};

export default FilterForm;
