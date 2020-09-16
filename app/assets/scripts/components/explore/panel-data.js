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
    // { name: 'Population', range: [0, 1000000], info: 'This filter has info.', isRange: true },
    // { name: 'Slope', range: [0, 10000], info: 'This filter has info.', isRange: true },
    // { name: 'Land Cover', range: [0, 10000], info: 'This filter has info.', isRange: true }
  ]
};

export const lcoeList = [
  { name: 'Generation - capital [USD/kW] (Cg)' },
  { name: 'Generation - fixed O&M [USED/MWh]' }
];

export const weightsList = [
  { name: 'LCOE Generation' },
  { name: 'LOCOE Transmission' },
  { name: 'LCOE Road' },
  { name: 'Distance to Load Centers' },
  { name: 'Technology Co-Location' },
  { name: 'Human Footprint' },
  { name: 'Population Density' },
  { name: 'Slope' },
  { name: 'Land Use Score' },
  { name: 'Capacity Value (Wind Only)' }
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
