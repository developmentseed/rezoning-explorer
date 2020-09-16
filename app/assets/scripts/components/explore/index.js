import React from 'react';
import { ExploreProvider } from '../../context/explore-context';

import Explore from './explore';

function ExploreComponent () {
  return (
    <ExploreProvider>
      <Explore />
    </ExploreProvider>
  );
}

export default ExploreComponent;
