const WIND = 'Onshore Wind';
const OFFSHORE = 'Off-Shore Wind';
const SOLAR = 'Solar PV';
export const RESOURCES = {
  WIND, OFFSHORE, SOLAR
};

export const setRangeByUnit = ([min, max], unit) => {
  switch (unit) {
    case 'km':
      return [min / 1000, max / 1000];
    default:
      return [min, max];
  }
};

export const getMultiplierByUnit = unit => {
  switch (unit) {
    case 'km':
      return 1000;
    default:
      return 1;
  }
};

export const apiResourceNameMap = {
  [WIND]: 'wind',
  [SOLAR]: 'solar',
  [OFFSHORE]: 'offshore'
};

export const appToApiResourceNameMap = {
  wind: WIND,
  solar: SOLAR,
  offshore: OFFSHORE
};

export const checkIncluded = (obj, resource) => {
  return obj.energy_type.includes(apiResourceNameMap[resource]);
};

export const resourceList = [
  {
    name: SOLAR,
    iconPath: 'assets/graphics/content/resourceIcons/solar-pv.svg'
  },
  {
    name: WIND,
    iconPath: 'assets/graphics/content/resourceIcons/wind.svg'
  },
  {
    name: OFFSHORE,
    iconPath: 'assets/graphics/content/resourceIcons/wind-offshore.svg'
  }
];

const SLIDER = 'slider';
const BOOL = 'boolean';
const MULTI = 'multi-select';
const TEXT = 'text';
const DROPDOWN = 'dropdown';
const GRID_OPTIONS = [25, 50];
const DEFAULT_RANGE = [0, 1000000];
const DEFAULT_UNIT = '%';
export const DEFAULT_WEIGHT_RANGE = [0, 1];
export const DEFAULT_WEIGHT_VALUE = 0.5;

export const INPUT_CONSTANTS = {
  SLIDER,
  BOOL,
  MULTI,
  DROPDOWN,
  TEXT,
  GRID_OPTIONS,
  DEFAULT_UNIT,
  DEFAULT_RANGE
};

export const allowedTypes = new Map();
allowedTypes.set('range_filter', SLIDER);
allowedTypes.set('boolean', BOOL);
allowedTypes.set('categorical_filter', MULTI);

export const presets = {};
