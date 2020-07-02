'use strict';
import defaultsDeep from 'lodash.defaultsdeep';
/*
 * App configuration.
 *
 * Uses settings in config/production.js, with any properties set by
 * config/staging.js or config/local.js overriding them depending upon the
 * environment.
 *
 * This file should not be modified.  Instead, modify one of:
 *
 *  - config/production.js
 *      Production settings (base).
 *  - config/staging.js
 *      Overrides to production if ENV is staging.
 *  - config/local.js
 *      Overrides if local.js exists.
 *      This last file is gitignored, so you can safely change it without
 *      polluting the repo.
 */

import production from './config/production';
import staging from './config/staging';
// eslint-disable-next-line import/no-unresolved
// import local from './config/local';
// import test from './config/test';

// var config = configurations.production || {};
let config = production || {};

if (process.env.NODE_ENV === 'staging') {
  config = defaultsDeep(staging, config);
}
if (process.env.NODE_ENV === 'development') {
  config = defaultsDeep(local || {}, config);
}
export default config;
