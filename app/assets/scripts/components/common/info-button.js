import React from 'react';
import T from 'prop-types';
import ReactTooltip from 'react-tooltip';
import Button from '../../styles/button/button';
import styled from 'styled-components';
const StyledTooltip = styled(ReactTooltip)`
  width: ${({ width }) => width || 'auto'};
`;

function InfoButton (props) {
  const { info, id, useIcon, width } = props;
  return (
    <>
      <Button
        hideText
        useIcon={useIcon || 'circle-information'}
        data-tip
        data-for={id}
        className='info-button'
        {...props}
      >
        {props.children}
      </Button>
      {info &&
        <StyledTooltip width={width} id={id} place='bottom' effect='float'>
          {info}
        </StyledTooltip>}
    </>
  );
}

InfoButton.propTypes = {
  info: T.string,
  id: T.string,
  children: T.node,
  useIcon: T.oneOfType([T.string, T.array]),
  width: T.string
};

export default InfoButton;
