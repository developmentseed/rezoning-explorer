import React from 'react';
import styled from 'styled-components';
import { panelSkin } from '../../styles/skins';

const HistogramWrapper = styled.div`
  ${panelSkin()};
  position: relative;
  display: flex;
  flex-flow: column;
  min-width: 0;
`;
function Histogram (props) {
  return (<HistogramWrapper>
    I am histogram
          </HistogramWrapper>);
}

export default Histogram;
