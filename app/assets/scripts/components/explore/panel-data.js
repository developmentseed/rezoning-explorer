import { randomRange } from '../../utils/utils';

export const resourceList = ['Solar', 'Wind', 'Off-Shore Wind'];

export const filtersLists = {
  zone_parameters: [
    { name: 'Zone Score', range: [0, 1] },
    { name: 'Mean Capacity Factor', range: [0, 1] },
    { name: 'Electricity Demand', range: [0, 100], unit: 'k' }
  ],
  infrastructure_layers: [
    { name: 'Zone Score', range: [0, 1] },
    { name: 'Mean Capacity Factor', range: [0, 1] },
    { name: 'Electricity Demand', range: [0, 100], unit: 'k' }
  ],
  environmental_layers: [
    { name: 'Zone Score', range: [0, 1] },
    { name: 'Mean Capacity Factor', range: [0, 1] },
    { name: 'Electricity Demand', range: [0, 100], unit: 'k' }
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
    test: Object.entries(filtersLists).reduce((accum, [name, group]) => {
      return (
        {
          ...accum,
          [name]: group.map(filter => ({ ...filter, value: filter.range ? randomRange(filter.range[0], filter.range[1]) : randomRange(0, 100) }))
        }
      );
    }, {})
  },
  lcoe: {
    test: lcoeList.map(lcoe => ({
      ...lcoe,
      value: lcoe.range ? randomRange(lcoe.range[0], lcoe.range[1]) : randomRange(0, 100)
    }))
  }
};
