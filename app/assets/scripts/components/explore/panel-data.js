import { randomRange } from '../../utils/utils';

export const resourceList = [
  {
    name: 'Solar PV',
    iconPath: 'assets/graphics/content/resourceIcons/solar-pv.svg'
  },
  {
    name: 'Wind',
    iconPath: 'assets/graphics/content/resourceIcons/wind.svg'
  },
  {
    name: 'Off-Shore Wind',
    iconPath: 'assets/graphics/content/resourceIcons/wind-offshore.svg'
  }
];

const SLIDER = 'slider';
const BOOL = 'bool';
const MULTI = 'multi-select';
const TEXT = 'text';
const GRID_OPTIONS = [9, 25, 50];
const DEFAULT_RANGE = [0, 100];
const DEFAULT_UNIT = '%';

export const INPUT_CONSTANTS = {
  SLIDER,
  BOOL,
  MULTI,
  TEXT,
  GRID_OPTIONS,
  DEFAULT_UNIT,
  DEFAULT_RANGE
};

export const filtersLists = {
  distance_filters: [
    {
      name: 'Distance to Airports',
      info: 'Areas within a defined distance to airports.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 1000000],
        isRange: true
      }
    },
    {
      name: 'Distance to Ports',
      info: 'Areas within a defined distance to ports.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 1000000],
        isRange: true
      }

    },
    {
      name: 'Distance to Anchorages',
      info: 'This filter has info.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 1000000],
        isRange: true
      }

    },
    {
      name: 'Distance to Transmission Lines',
      info: 'Areas within a defined distance to transmission lines.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 1000000],
        isRange: true
      }
    },
    {
      name: 'Distance to Roads',
      info: 'Areas within a defined distance to roads.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 10000],
        isRange: true
      }

    },
    {
      name: 'Population Density (people/km^2)',
      info: 'A measurement of population per unit area.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 1000000],
        isRange: true
      }
    },
    {
      name: 'Slope',
      info: 'The steepness or angle considered with reference to the horizon.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 10000],
        isRange: true
      }
    },
    {
      name: 'Land Cover',
      info: 'This filter has info.',
      isRange: true,
      input: {
        type: SLIDER,
        range: [0, 10000],
        isRange: true
      }

    }
  ]
};

export const lcoeList = [
  {
    name: 'Turbine / Solar Unit Type',
    id: 'turbine_type',
    input: {
      type: TEXT,
      range: [0, 3]
    }
  },
  {
    name: 'Capital Recovery Factor',
    id: 'crf',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Generation - capital [USD/kW]',
    id: 'cg',
    input: {
      type: TEXT
    }

  },
  {
    name: 'Generation - fixed O&M [USD/MW/y]',
    id: 'omfg',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Generation - variable O&M [USD/MWh]',
    id: 'omvg',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Transmission (land cabling) - capital [USD/MW/km]',
    id: 'ct',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Transmission - fixed O&M [USD/km]',
    id: 'omft',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Substation - capital [USD / two substations (per new transmission connection) ]',
    id: 'cs',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Road - capital [USD/km]',
    id: 'cr',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Road - fixed O&M [USD/km]',
    id: 'omfr',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Decommission % rate',
    id: 'decom',
    input: {
      type: TEXT
    }
  },
  {
    name: 'Economic discount rate',
    id: 'i',
    input: {
      type: TEXT,
      range: [0.1, 100]
    }
  },
  {
    name: 'Lifetime [years]',
    id: 'n',
    range: [1, 100],
    input: {
      type: TEXT,
      range: [1, 100]
    }
  }
];

export const weightsList = [
  {
    name: 'LCOE Generation',
    id: 'lcoe_gen',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'LCOE Transmission',
    id: 'lcoe_transmission',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }

  },
  {
    name: 'LCOE Road',
    id: 'lcoe_road',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'Distance to Load Centers',
    id: 'distance_load',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'Technology Co-Location',
    id: 'technology_colocation',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'Human Footprint',
    id: 'human_footprint',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'Population Density',
    id: 'pop_density',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'Slope',
    id: 'slope',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'Land Use Score',
    id: 'land_use',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  },
  {
    name: 'Capacity Value (Wind Only)',
    id: 'capacity_value',
    range: [0, 1],
    default: 1,
    input: {
      type: SLIDER,
      range: [0, 1],
      default: 1
    }
  }
];

const LCOE_PRESETS = {
  greatest_savings: {
    turbine_type: 0,
    crf: 1,
    cg: 2000,
    omfg: 50000,
    omvg: 4,
    ct: 990,
    omft: 0,
    cs: 71000,
    cr: 407000,
    omfr: 0,
    decom: 0,
    i: 0.2,
    n: 25
  }
};

export const presets = {
  weights: {
    'Power Output': weightsList.map(weight => ({
      ...weight,
      input: {
        ...weight.input,
        value: weight.range ? randomRange(weight.range[0], weight.range[1]) : randomRange(0, 100)
      }
    }))
  },
  filters: {
    Optimization: Object.entries(filtersLists).reduce((accum, [name, group]) => {
      return (
        {
          ...accum,
          [name]: group.map(filter => (
            {
              ...filter,
              input: {
                ...filter.input,
                value: {
                  max: filter.range ? randomRange(filter.range[0], filter.range[1]) : randomRange(0, 100),
                  min: filter.range ? filter.range[0] : 0
                }
              }
            }
          ))
        }
      );
    }, {})
  },
  lcoe: {
    'Greatest Savings': lcoeList.map(lcoe => ({
      ...lcoe,
      input: {
        ...lcoe.input,
        value: LCOE_PRESETS.greatest_savings[lcoe.id]
      }
    }))
  }
};
