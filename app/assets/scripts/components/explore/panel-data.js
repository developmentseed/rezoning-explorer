export const resourceList = ['Solar', 'Wind', 'Off-Shore Wind'];

export const filtersLists = {
  zone_parameters: [
    { name: 'Zone Score', range: [0, 1] },
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
