import { createGlobalStyle, css } from 'styled-components';
import { normalize, rgba } from 'polished';

import { themeVal, stylizeFunction } from './utils/general';
import media from './utils/media-queries';
// import { collecticonsFont } from '@devseed-ui/collecticons';
import { collecticonsFont } from './collecticons';
import { unscrollableY, unscrollableX } from './helpers';
import mapboxStyles from './vendor/mapbox';
import reactDatepickerStyles from './vendor/react-datepicker';
import reactToastStyles from './vendor/react-toastify';
import reactTooltipStyles from './vendor/react-tooltip';
import reactInputRangeStyles from './vendor/react-input-range';

const _rgba = stylizeFunction(rgba);

// Global styles for these components are included here for performance reasons.
// This way they're only rendered when absolutely needed.

const baseStyles = css`
  html {
    box-sizing: border-box;
    font-size: ${themeVal('type.base.root')};
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  * {
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${themeVal('color.background')};
    color: ${themeVal('type.base.color')};
    font-size: ${themeVal('type.base.size')};
    line-height: ${themeVal('type.base.line')};
    /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
    font-family: ${themeVal('type.base.family')};
    font-weight: ${themeVal('type.base.weight')};
    font-style: ${themeVal('type.base.style')};
    min-width: ${themeVal('layout.min')};

    ${({ theme }) => theme.type.base.antialiasing &&
    css`
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    `}

  }


  /* Links
   ========================================================================== */

  a {
    cursor: pointer;
    color: ${themeVal('color.link')};
    text-decoration: none;
    transition: opacity 0.24s ease 0s;
  }

  a:visited {
    color: ${themeVal('color.link')};
  }

  a:hover {
    opacity: 0.64;
  }

  a:active {
    transform: translate(0, 1px);
  }


  /* Buttons
   ========================================================================== */

  [role="button"] {
    cursor: pointer;
  }


  /* Forms
     ========================================================================== */

  input, select, textarea {
    font: inherit;
    height: auto;
    width: auto;
    margin: 0;
  }


  /* Tables
   ========================================================================== */

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }


  /* Lists
   ========================================================================== */

  ol, ul {
    list-style: none;
  }


  /* Blockquotes
   ========================================================================== */

  blockquote, q {
    quotes: none;
  }

  blockquote::before, blockquote::after,
  q::before, q::after {
    content: '';
    content: none;
  }


  /* Text-level semantics
   ========================================================================== */

  b,
  strong {
    font-weight: ${themeVal('type.base.bold')};
  }


  /* Misc
     ========================================================================== */

  ::selection {
    background-color: ${_rgba(themeVal('color.base'), 0.64)};
    color: ${themeVal('color.baseLight')};
  }

  .tether-element {
    z-index: 1000;
  }

  .unscrollable-y {
    ${unscrollableY()}
  }

  .unscrollable-x {
    ${unscrollableX()}
  }

  #app-container {
    position: relative;
    overflow: hidden;
    
    > .page {
      min-height: ${({ innerHeight }) => `${innerHeight}px`};
    }
  }

  #modal-select {
    background: ${themeVal('color.baseAlphaB')};
    top: 4rem;
    ${media.mediumUp`
      top: 0;
      left: 4rem;
    `}
  }
`;

export default createGlobalStyle`
  ${normalize()}
  ${collecticonsFont()}
  ${mapboxStyles()}
  ${reactDatepickerStyles()}
  ${reactTooltipStyles()}
  ${reactToastStyles()}
  ${reactInputRangeStyles()}
  ${baseStyles}
`;
