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
  zone_parameters: [
    { name: 'Zone Score', range: [0, 1], info: 'This filter has info.' },
    { name: 'Mean Capacity Factor', range: [0, 1] },
    { name: 'Electricity Demand', range: [0, 100], unit: 'k' }
  ],
  infrastructure_layers: [
    { name: 'Layer score', range: [0, 1] },
    { name: 'Prop 2', range: [0, 1] },
    { name: 'Prop 3', range: [0, 100], unit: 'k' }
  ],
  environmental_layers: [
    { name: 'Env Prop 1', range: [0, 1] },
    { name: 'Env Prop 2', range: [0, 1] },
    { name: 'Env Prop 3', range: [0, 100], unit: 'k' }
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
