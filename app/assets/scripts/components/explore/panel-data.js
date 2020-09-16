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

export const filtersLists = {
  distance_filters: [
    { name: 'Distance to Airports', range: [0, 1000000], info: 'This filter has info.', isRange: true },
    { name: 'Distance to Ports', range: [0, 1000000], info: 'This filter has info.', isRange: true },
    { name: 'Distance to Anchorages', range: [0, 1000000], info: 'This filter has info.', isRange: true },
    { name: 'Distance to Grids', range: [0, 1000000], info: 'This filter has info.', isRange: true },
    { name: 'Distance to Roads', range: [0, 10000], info: 'This filter has info.', isRange: true },
    { name: 'Population', range: [0, 1000000], info: 'This filter has info.', isRange: true },
    { name: 'Slope', range: [0, 10000], info: 'This filter has info.', isRange: true },
    { name: 'Land Cover', range: [0, 10000], info: 'This filter has info.', isRange: true }
  ]
};

export const lcoeList = [
  { name: 'Turbine / Solar Unit Type', id: 'turbine_type', range: [0, 100] },
  { name: 'Capital Recovery Factor', id: 'crf' },
  { name: 'Generation - capital [USD/kW]', id: 'cg' },
  { name: 'Generation - fixed O&M [USD/MW/y]', id: 'omfg' },
  { name: 'Generation - variable O&M [USD/MWh]', id: 'omvg' },
  { name: 'Transmission (land cabling) - capital [USD/MW/km]', id: 'ct' },
  { name: 'Transmission - fixed O&M [USD/km]', id: 'omft' },
  { name: 'Substation - capital [USD / two substations (per new transmission connection) ]', id: 'cs' },
  { name: 'Road - capital [USD/km]', id: 'cr' },
  { name: 'Road - fixed O&M [USD/km]', id: 'omfr' },
  { name: 'Decommission % rate', id: 'decom' },
  { name: 'Economic discount rate', id: 'i', range: [1, 100] },
  { name: 'Lifetime [years]', id: 'n', range: [1, 100] }
];

export const weightsList = [
  { name: 'LCOE Generation', id: 'lcoe_gen', range: [0, 1] },
  { name: 'LCOE Transmission', id: 'lcoe_transmission', range: [0, 1] },
  { name: 'LCOE Road', id: 'lcoe_road', range: [0, 1] },
  { name: 'Distance to Load Centers', id: 'distance_load', range: [0, 1] },
  { name: 'Technology Co-Location', id: 'technology_colocation', range: [0, 1] },
  { name: 'Human Footprint', id: 'human_footprint', range: [0, 1] },
  { name: 'Population Density', id: 'pop_density', range: [0, 1] },
  { name: 'Slope', id: 'slope', range: [0, 1] },
  { name: 'Land Use Score', id: 'land_use', range: [0, 1] },
  { name: 'Capacity Value (Wind Only)', id: 'capacity_value', range: [0, 1] }
];

export const presets = {
  weights: {
    'Power Output': weightsList.map(weight => ({
      ...weight,
      value: weight.range ? randomRange(weight.range[0], weight.range[1]) : randomRange(0, 100)
    }))
  },
  filters: {
    Optimization: Object.entries(filtersLists).reduce((accum, [name, group]) => {
      return (
        {
          ...accum,
          [name]: group.map(filter => ({ ...filter, value: filter.range ? randomRange(filter.range[0], filter.range[1]) : randomRange(0, 100) }))
        }
      );
    }, {})
  },
  lcoe: {
    'Greatest Savings': lcoeList.map(lcoe => ({
      ...lcoe,
      value: lcoe.range ? randomRange(lcoe.range[0], lcoe.range[1]) : randomRange(0, 100)
    }))
  }
};
