import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import ExploreContext from '../../context/explore-context';

import ModalSelect from './modal-select';
import FormInput from '../../styles/form/input';
import { Card } from '../common/card-list';
import { ModalHeader } from '@devseed-ui/modal';

const SearchBar = styled(FormInput)`
  max-width: 60ch;
  margin: 0 auto;
`;

const HeaderWrapper = styled(ModalHeader)`
  display: grid;
  grid-template-columns: 1fr;
`;

const Headline = styled.h1`
  text-align: center;
  ${({ disabled }) => disabled && 'opacity: 0.24'}
`;

function ModalSelectArea () {
  const [areaType, setAreaType] = useState('country');
  const [searchValue, setSearchValue] = useState('');

  const {
    areas,
    selectedResource,
    showSelectAreaModal,
    setShowSelectAreaModal,
    setSelectedAreaId
  } = useContext(ExploreContext);

  const areaList = areas.filter((a) => a.type === areaType);

  return (
    <ModalSelect
      revealed={showSelectAreaModal}
      onOverlayClick={() => {
        if (selectedResource) {
          setShowSelectAreaModal(false);
        }
      }}
      data={areaList}
      renderHeader={() => (
        <HeaderWrapper id='select-area-modal-header'>
          <Headline
            disabled={areaType !== 'country'}
            onClick={() => setAreaType('country')}
          >
            Select Country
          </Headline>
          <Headline
            disabled={areaType !== 'region'}
            onClick={() => setAreaType('region')}
          >
            Select Region
          </Headline>
          <SearchBar
            type='text'
            placeholder='Start typing area name to see your choice, or select one below'
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </HeaderWrapper>
      )}
      filterCard={(card) =>
        card.name.toLowerCase().includes(searchValue.toLowerCase())}
      renderCard={(area) => (
        <Card
          id={`area-${area.id}-card`}
          key={area.id}
          title={area.name}
          iconPath={
            areaType === 'country'
              ? `/assets/graphics/content/flags-4x3/${area.id}.svg`
              : undefined
          }
          size='small'
          onClick={() => {
            setShowSelectAreaModal(false);
            setSelectedAreaId(area.id);
          }}
        />
      )}
    />
  );
}

ModalSelectArea.propTypes = {};

export default ModalSelectArea;
