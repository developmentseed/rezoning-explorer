import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

import ExploreContext from '../../context/explore-context';

import ModalSelect from './modal-select';
import FormInput from '../../styles/form/input';
import { Card } from '../common/card-list';
import { ModalHeader } from '@devseed-ui/modal';

const SearchBar = styled(FormInput)`
  width: 100%;
`;

const HeaderWrapper = styled(ModalHeader)`
  display: flex;
  flex-flow: column nowrap;
  width: 80%;
  margin: 0 auto;
`;

const Headline = styled.h3`
  text-align: center;
  cursor: pointer;
  ${({ disabled }) => disabled && 'opacity: 0.24;'}
  & + & {
    padding-left: 2rem;
  }
`;

const HeadlineTabs = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

function ModalSelectArea () {
  const {
    areas,
    selectedResource,
    showSelectAreaModal,
    setShowSelectAreaModal,
    setSelectedAreaId
  //  areaTypeFilter
  } = useContext(ExploreContext);
  // const [areaType, setAreaType] = useState(areaTypeFilter[0]);
  const [areaType, setAreaType] = useState('country');
  const [searchValue, setSearchValue] = useState('');

  // useEffect(() => setAreaType(areaTypeFilter[0]), [areaTypeFilter]);

  return (
    <ModalSelect
      revealed={showSelectAreaModal}
      onOverlayClick={() => {
        if (selectedResource) {
          setShowSelectAreaModal(false);
        }
      }}
      data={areas.filter((a) => a.type === areaType)}
      renderHeader={() => (
        <HeaderWrapper id='select-area-modal-header'>
          <HeadlineTabs>{
            // areaTypeFilter.map(t => (
            ['country', 'region'].map(t => (
              <Headline
                key={t}
                disabled={areaType !== t}
                onClick={() => setAreaType(t)}
              >
              Select {t[0].toUpperCase() + t.slice(1)}
              </Headline>

            ))
          }
          </HeadlineTabs>
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
              ? `/assets/graphics/content/flags-4x3/${area.alpha2.toLowerCase()}.svg`
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
