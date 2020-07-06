import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';

import { FormSelect, FormInput } from '../../styles/form';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockFooter
} from '../common/panel-block';
import TabbedBlockBody from '../common/tabbed-block-body';
import Button from '../../styles/button/button';
import SliderGroup from '../common/slider-group';

const ParamTitle = styled.div`
/* stylelint-disable */
`;
const Param = styled.div`
`;
const WeightsForm = styled.div`
`;
const FiltersForm = styled.div`
`;
const LCOEForm = styled.div`
/* stylelint-enable */
`;

const SubmissionSection = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0rem 1rem;

`;

function ParamForm (props) {
  const { countryList, resourceList, weightsList, filtersList, lcoeList } = props;
  return (
    <PanelBlock>
      <PanelBlockHeader>
        <Param>
          <ParamTitle>Country</ParamTitle>
          <FormSelect>
            {countryList.map(country => (
              <option key={country} value={country.replace(/ /g, '-')}>{country}</option>
            ))}
          </FormSelect>
        </Param>

        <Param>
          <ParamTitle>Resource</ParamTitle>
          <FormSelect>
            {resourceList.map(resource => (
              <option key={resource} value={resource.replace(/ /g, '-')}>{resource}</option>
            ))}

          </FormSelect>
        </Param>

      </PanelBlockHeader>

      <TabbedBlockBody
        tabContent={[['Weights', 'house'], ['Filters', 'crosshair'], ['LCOE', 'crosshair']]}
      >
        <WeightsForm>
          {weightsList.map(filter => (
            <Param key={filter.name}>
              <ParamTitle>{filter.name}</ParamTitle>
              <SliderGroup unit={filter.unit || '%'} range={filter.range || [0, 100]} />
            </Param>
          ))}
        </WeightsForm>

        <FiltersForm>
          {filtersList.map(filter => (
            <Param key={filter.name}>
              <ParamTitle>{filter.name}</ParamTitle>
              <SliderGroup unit={filter.unit || '%'} range={filter.range || [0, 100]} />
            </Param>
          ))}
        </FiltersForm>

        <LCOEForm>
          {lcoeList.map(filter => (
            <Param key={filter.name}>
              <ParamTitle>{filter.name}</ParamTitle>
              <FormInput />
            </Param>
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
