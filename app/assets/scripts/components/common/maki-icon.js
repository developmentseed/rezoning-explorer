import React from 'react';
import T from 'prop-types';

export default function MakiIcon({ id }) {
  return <img src={`/assets/graphics/maki/${id}.svg`} />;
}

MakiIcon.propTypes = {
  id: T.string.isRequired
};
