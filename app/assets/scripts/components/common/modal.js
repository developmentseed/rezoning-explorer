import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 16;
  width: 60vw;
  height: 60vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: white;
`;

function Modal (props) {
  const { visible, children } = props;
  return (
    <>
      {visible &&
      <ModalWrapper>
        {props.children}
      </ModalWrapper>}

    </>
  );
}

export default Modal;
