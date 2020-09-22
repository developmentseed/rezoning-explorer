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
    revealed, onOverlayClick, data,
    renderHeader, renderCard, filterCard,
    nonScrolling
  } = props;

  return (
    <Modal
      id='modal-select'
      className='select'
      size='xlarge'
      revealed={revealed}
      onOverlayClick={onOverlayClick}
      closeButton={false}
      renderHeader={renderHeader}
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
  data: T.array,
  renderHeader: T.func,
  renderCard: T.func,
  filterCard: T.func,
  nonScrolling: T.bool
};
export default ModalSelect;
