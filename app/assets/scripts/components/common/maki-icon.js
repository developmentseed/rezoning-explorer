import React from 'react';
import T from 'prop-types';

export default function MakiIcon({ id }) {
  return <img src={`/assets/icons/maki/${id}.svg`} />;
}

MakiIcon.propTypes = {
  id: T.string.isRequired
};
