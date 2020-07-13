import React from 'react';
import T from 'prop-types';
import { Modal } from '@devseed-ui/modal';
import CardList from '../common/card-list';

function ModalSelect (props) {
  const { revealed, onOverlayClick, data, renderHeader, renderCard, filterCard } = props;

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
        <CardList
          data={data}
          renderCard={renderCard}
          filterCard={filterCard}
        />
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
  filterCard: T.func
};
export default ModalSelect;
