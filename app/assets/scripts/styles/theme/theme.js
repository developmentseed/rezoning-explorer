import { rgba } from 'polished';

let color = {
  baseLight: '#FFFFFF',
  baseDark: '#374863',
  primary: '#23A6F5',
  secondary: '#05377a'
};

color = {
  ...color,
  base: color.baseDark,
  background: color.baseLight,
  surface: color.baseLight,
  link: color.primary,
  danger: '#B3241C', // Red
  success: '#189C54', // Dark Green
  warning: '#F39C12', // Yellow
  info: color.secondary
};

color = {
  ...color,
  smoke: rgba(color.base, 0.16),
  baseAlphaA: rgba(color.base, 0.04),
  baseAlphaB: rgba(color.base, 0.08),
  baseAlphaC: rgba(color.base, 0.16),
  baseAlphaD: rgba(color.base, 0.32),
  primaryAlpha: rgba(color.primary, 0.16),
  silk: `radial-gradient(farthest-side, ${color.surface}, ${rgba(
    color.surface,
    0.64
  )})`
};

const type = {
  base: {
    root: '16px',
    size: '1rem',
    line: '1.5',
    color: color.base,
    family: '"IBM Plex Sans", sans-serif',
    style: 'normal',
    weight: 400,
    light: 300,
    regular: 400,
    medium: 400,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    antialiasing: true
  },
  heading: {
    family: '"IBM Plex Sans", sans-serif',
    style: 'normal',
    weight: 600,
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700
  },
  mono: {
    family: '"IBM Plex Mono", monospaced',
    style: 'normal',
    weight: 400
  }
};

const shape = {
  square: 0,
  rounded: '0.125rem',
  ellipsoid: '320rem'
};

const layout = {
  space: '1rem',
  border: '1px',
  min: '320px',
  max: '1280px'
};

export default {
  main: {
    layout,
    color,
    type,
    shape
  }
};

/**
 * Media query ranges used by the media utility.
 * They're not exported with the main theme because the utility does not
 * build the media functions in runtime, needing the values beforehand.
 */
export const mediaRanges = {
  xsmall: [null, 543],
  small: [544, 767],
  medium: [768, 1023],
  large: [1024, 1399],
  xlarge: [1400, null]
};
