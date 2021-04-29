import React from 'react';
import config from './config';

const { environment, wdyrLogs } = config;

if (environment === 'development' && wdyrLogs) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true
  });
}
