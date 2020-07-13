import React, { useContext, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Panel from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';
import ModalSelect from './modal-select';
import FormInput from '../../styles/form/input';
import { ModalHeader } from '../common/modal';

import { Card } from '../common/card-list';

import QueryForm from './query-form';

import { resourceList, weightsList, filtersList, lcoeList } from './panel-data';

const PRESETS = [];

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 20rem;
  `}
`;
const SearchBar = styled(FormInput)`
/* stylelint-disable no-empty-source */
`;

function ExpMapPrimePanel (props) {
  const { onPanelChange } = props;

  const [showCountrySelect, setShowCountrySelect] = useState(true);
  const [showResourceSelect, setShowResourceSelect] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState('Select a country');
  const [countryFilter, setCountryFilter] = useState('');

  const [selectedResource, setSelectedResource] = useState('Select a resource');

  const { countries } = useContext(ExploreContext);

  return (
    <>
      <PrimePanel
        collapsible
        direction='left'
        onPanelChange={onPanelChange}
        initialState={isLargeViewport()}
        bodyContent={
          <>
            <QueryForm
              country={selectedCountry}
              resource={selectedResource}
              weightsList={weightsList}
              filtersList={filtersList}
              lcoeList={lcoeList}
              presetList={PRESETS}
              onCountryEdit={() => setShowCountrySelect(true)}
              onResourceEdit={() => setShowResourceSelect(true)}
            />
          </>
        }
      />
      <ModalSelect
        revealed={showResourceSelect}
        onOverlayClick={() => {
          setShowResourceSelect(false);
        }}
        data={resourceList}
        renderHeader={() => (
          <ModalHeader title='Select Resouce' />
        )}
        renderCard={(resource) => (
          <Card
            key={resource}
            title={resource}
            // iconPath={`/assets/graphics/content/flags-4x3/${country.id}.svg`}
            size='large'
            onClick={() => {
              setShowResourceSelect(false);
              setSelectedResource(resource);
            }}
          />
        )}
      />

      <ModalSelect
        revealed={showCountrySelect}
        onOverlayClick={() => {
          setShowCountrySelect(false);
        }}
        data={countries.isReady() ? countries.getData().countries : []}
        renderHeader={() => (
          <ModalHeader title='Select Country'>
            <SearchBar
              type='text'
              placeholder='Start typing countryname to see your choice, or click on a country below'
              onChange={e => setCountryFilter(e.target.value)}
              value={countryFilter}
            />
          </ModalHeader>
        )}
        filterCard={(country) => country.name.includes(countryFilter)}
        renderCard={(country) => (
          <Card
            key={country.name}
            title={country.name}
            iconPath={`/assets/graphics/content/flags-4x3/${country.id}.svg`}
            size='small'
            onClick={() => {
              setShowCountrySelect(false);
              setSelectedCountry(country.name);
            }}
          />
        )}
      />
    </>
  );
}

ExpMapPrimePanel.propTypes = {
  onPanelChange: T.func
};

export default ExpMapPrimePanel;
