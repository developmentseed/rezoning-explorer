import React from 'react';
import { Form, FormSelect } from '../../styles/form';
import SliderGroup from '../common/slider-group';

function FilterForm () {
  return (
    <Form>
      <FormSelect>
        <option value='zambia'>Zambia</option>
      </FormSelect>

      <FormSelect>
        <option value='zambia'>Solar</option>
      </FormSelect>

      <SliderGroup />

    </Form>

  );
}

export default FilterForm;
