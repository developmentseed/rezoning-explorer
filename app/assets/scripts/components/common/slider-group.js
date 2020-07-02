import React, { useState } from 'react';
import styled from 'styled-components';
import { FormInput } from '../../styles/form';

const SliderWrapper = styled.div`
  display:grid;
  grid-template-columns:200px 50px;
  gap: 0 20px;
`;

function SliderGroup () {
  const [value, setValue] = useState(0);

  return (
    <SliderWrapper>
      <FormInput type='range' min={0} max={100} value={value} onChange={(e) => setValue(e.target.value)} />
      <FormInput type='number' value={value} onChange={(e) => setValue(e.target.value)} />
    </SliderWrapper>
  );
}

export default SliderGroup;
