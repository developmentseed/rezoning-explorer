import React from 'react';
import T from 'prop-types';
import { Modal } from '@devseed-ui/modal';
import CardList from '../common/card-list';

function ModalSelect (props) {
  const { revealed, onOverlayClick, data, renderHeader, renderCard } = props;

  return (
    <Modal
      id='country-select'
      size='medium'
      revealed={revealed}
      onOverlayClick={onOverlayClick}
      closeButton={false}

      renderHeader={renderHeader}

      content={
        <CardList
          data={data}
          renderItem={renderCard}
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
  renderCard: T.func
};
export default ModalSelect;
