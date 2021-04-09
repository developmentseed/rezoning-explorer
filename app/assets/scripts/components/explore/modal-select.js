import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import CardList from '../common/card-list';

const BodyOuter = styled.div`
  height: 45vh;
`;

function ModalSelect (props) {
  const {
    revealed, onOverlayClick, onCloseClick, data,
    renderHeadline, renderCard, filterCard,
    nonScrolling
  } = props;

  return (
    <Modal
      id='modal-select'
      className='select'
      size='xlarge'
      revealed={revealed}
      onOverlayClick={onOverlayClick}
      onCloseClick={onCloseClick}
      renderHeadline={renderHeadline}
      filterCard={filterCard}
      content={
        <BodyOuter>
          <CardList
            data={data}
            renderCard={renderCard}
            filterCard={filterCard}
            nonScrolling={nonScrolling}
          />
        </BodyOuter>
      }
    />
  );
}

ModalSelect.propTypes = {
  revealed: T.bool,
  onOverlayClick: T.func,
  onCloseClick: T.func,
  data: T.array,
  renderHeadline: T.func,
  renderCard: T.func,
  filterCard: T.func,
  nonScrolling: T.bool
};
export default ModalSelect;
