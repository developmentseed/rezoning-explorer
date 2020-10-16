import React from 'react';
import T from 'prop-types';
import ReactTooltip from 'react-tooltip';
import Button from '../../styles/button/button';

function InfoButton (props) {
  const { info, id, useIcon } = props;
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
      <ReactTooltip id={id} place='bottom' effect='float'>
        {info}
      </ReactTooltip>
    </>
  );
}

InfoButton.propTypes = {
  info: T.string,
  id: T.string,
  children: T.node
};

export default InfoButton;
