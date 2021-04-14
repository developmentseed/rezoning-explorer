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
if (process.env.NODE_ENV === 'development') {
  ExploreComponent.whyDidYouRender = false;
}

export default ExploreComponent;
