import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { ModalHeader as LibraryModalHeader } from '@devseed-ui/modal';

const HeaderWrapper = styled(LibraryModalHeader)`
  display: grid;
  grid-template-columns: 1fr;
`;

const Headline = styled.h1`
  text-align: center; 
`;

export const ModalHeader = ({ id, title, children }) => {
  return (
    <HeaderWrapper id={id}>
      <Headline>{title}</Headline>
      {children}
    </HeaderWrapper>

  );
};

ModalHeader.propTypes = {
  id: T.string,
  title: T.string,
  children: T.node
};
