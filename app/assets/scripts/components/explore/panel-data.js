export const resourceList = ['Zambia', 'Nairobi', 'Mozambique'];

export const filtersList = [
  { name: 'Zone Score', range: [0, 1] },
  { name: 'Mean Capacity Factor', range: [0, 1] },
  { name: 'Electricity Demand', range: [0, 100], unit: 'k' }
];

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
