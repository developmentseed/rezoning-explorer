import React from 'react';
import styled from 'styled-components';

import Tray from '../common/tray';
const Content = styled.div`
  width: 4rem;
  height: 10rem;

`

function RasterTray (props) {
  const { size, show } = props;
  return (
    <Tray
      size={size}
      show={show}
    >
      <Content />
    </Tray>
  );
}

export default RasterTray;
