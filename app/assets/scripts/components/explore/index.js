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
  ExploreComponent.whyDidYouRender = true;
}

export default ExploreComponent;
