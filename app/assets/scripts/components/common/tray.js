import React from 'react';
import styled, { css } from 'styled-components';

const TrayWrapper = styled.div`

  ${({ show, maxWidth, maxHeight }) => show ? css`
    max-width: ${maxWidth};
    max-height: ${maxHeight};
  ` : css`
    max-width: 0;
    max-height: 0;
  `};
  transition: max-width .16s ease 0s, max-height 0.16s ease 0s;
`;

const SIZE = {
  small: ['15rem', '20rem'],
  medium: ['25rem', '50rem'],
  large: ['35rem', '65rem'],
  xlarge: ['55rem', '75rem']
};

function Tray (props) {
  const {
    size,
    show,
    children
  } = props;
 
  const [maxWidth, maxHeight] = Array.isArray(size) ? size : SIZE[size || 'small'];
 return (
    <TrayWrapper
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      show={show}
    >
      {children}
    </TrayWrapper>
  );
}

export default Tray;
