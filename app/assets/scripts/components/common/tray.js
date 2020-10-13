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

  transition: max-width 0.16s ease 0s, max-height 0.16s ease 0s;
`;

const SIZE = {
  small: ['3rem', '5rem'],
  medium: ['5rem', '7rem'],
  large: ['10rem', '15rem'],
  xlarge: ['15rem', '20rem']
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
