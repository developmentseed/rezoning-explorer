import React, { useContext, useState, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';
import Panel from '../common/panel';
import media, { isLargeViewport } from '../../styles/utils/media-queries';
import ExploreContext from '../../context/explore-context';
import ModalSelect from './modal-select';
import FormInput from '../../styles/form/input';
import { ModalHeader } from '../common/modal';
import QsState from '../../utils/qs-state';

import { Card } from '../common/card-list';

import QueryForm from './query-form';

import {
  resourceList,
  weightsList,
  filtersLists,
  lcoeList,
  presets
} from './panel-data';

const qsStateHelper = new QsState({
  countryId: {
    accessor: 'countryId'
  },
  resource: {
    accessor: 'resource'
  }
});

const PrimePanel = styled(Panel)`
  ${media.largeUp`
    width: 20rem;
  `}
`;
const SearchBar = styled(FormInput)`
  max-width: 60ch;
  margin: 0 auto;
`;

function ExpMapPrimePanel (props) {
  const history = useHistory();
  const location = useLocation();

  /**
   * Helper function to apply state to the URL.
   *
   * @param {object} newState
   */
  function setUrl (newState) {
    const qString = qsStateHelper.getQs({
      countryId: selectedCountry && selectedCountry.id,
      resource: selectedResource,
      ...newState
    });
    history.push({ search: qString });
  }

  const { onPanelChange } = props;

  /**
   * Get Explore context values
   */
  const { countries } = useContext(ExploreContext);
  const {
    selectedCountry,
    setSelectedCountry,
    selectedResource,
    setSelectedResource
  } = useContext(ExploreContext);

  /**
   * Initialize state values. Check if the URL has country or resource set,
   * avoiding opening selector windows if that is the case.
   */
  const qsState = qsStateHelper.getState(location.search.substr(1));
  const [showCountrySelect, setShowCountrySelect] = useState(
    !qsState.countryId
  );
  const [showResourceSelect, setShowResourceSelect] = useState(
    !qsState.resource
  );
  const [countryFilter, setCountryFilter] = useState('');




  /**
   * On page mount, check if URL parameters are valid and set then to the view
   * state.
   */
  useEffect(() => {
    const { countryId, resource } = qsStateHelper.getState(
      location.search.substr(1)
    );

    if (!countryId) {
      // If not countryId is set, open modal
      setSelectedCountry(null);
      setShowCountrySelect(true);
    } else if (countries.isReady()) {
      const countryProps = countries
        .getData()
        .countries.find((c) => c.id === countryId);

      // If countryId is set and country is available, hide modal
      if (countryProps) {
        setSelectedCountry(countryProps);
        setShowCountrySelect(false);
      } else {
        setSelectedCountry(null);
        setShowCountrySelect(true);
      }
    }

    // Apply resource from URL or open modal if not set/valid
    if (resource && resourceList.indexOf(resource) > -1) {
      setSelectedResource(resource);
    } else {
      setSelectedResource(null);
      setShowResourceSelect(true);
    }
  }, [countries, location.search]);

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
              country={selectedCountry && selectedCountry.name}
              resource={selectedResource}
              weightsList={weightsList}
              filtersLists={filtersLists}
              lcoeList={lcoeList}
              presets={presets}
              onCountryEdit={() => setShowCountrySelect(true)}
              onResourceEdit={() => setShowResourceSelect(true)}
            />
          </>
        }
      />
      <ModalSelect
        revealed={showResourceSelect && !showCountrySelect}
        onOverlayClick={() => {
          if (selectedResource) {
            setShowResourceSelect(false);
          }
        }}
        data={resourceList}
        renderHeader={() => (
          <ModalHeader
            id='select-resource-modal-header'
            title='Select Resource'
          />
        )}
        renderCard={(resource) => (
          <Card
            id={`resource-${resource}-card`}
            key={resource}
            title={resource}
            size='large'
            onClick={() => {
              setShowResourceSelect(false);
              setSelectedResource(resource);
              setUrl({ resource });
            }}
          />
        )}
      />

      <ModalSelect
        revealed={showCountrySelect}
        onOverlayClick={() => {
          if (selectedResource) {
            setShowCountrySelect(false);
          }
        }}
        data={countries.isReady() ? countries.getData().countries : []}
        renderHeader={() => (
          <ModalHeader id='select-country-modal-header' title='Select Country'>
            <SearchBar
              type='text'
              placeholder='Start typing country name to see your choice, or click on a country below'
              onChange={(e) => setCountryFilter(e.target.value)}
              value={countryFilter}
            />
          </ModalHeader>
        )}
        filterCard={(country) => country.name.includes(countryFilter)}
        renderCard={(country) => (
          <Card
            id={`country-${country.id}-card`}
            key={country.id}
            title={country.name}
            iconPath={`/assets/graphics/content/flags-4x3/${country.id}.svg`}
            size='small'
            onClick={() => {
              setShowCountrySelect(false);
              setSelectedCountry(country);
              setUrl({ countryId: country.id });
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
