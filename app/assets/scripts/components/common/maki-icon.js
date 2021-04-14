import React from 'react';
import T from 'prop-types';

export default function MakiIcon({ id, size = 11 }) {
  return <img src={`/assets/icons/maki/${id}-${size}.svg`} />;
}

MakiIcon.propTypes = {
  id: T.string.isRequired,
  size: T.oneOf([11, 15])
};
