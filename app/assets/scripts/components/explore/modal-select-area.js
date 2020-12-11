import React, { useState } from 'react';
import styled from 'styled-components';
import T from 'prop-types';

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

function ModalSelectArea (props) {
  const {
    areas,
    selectedResource,
    showSelectAreaModal,
    setShowSelectAreaModal,
    setSelectedAreaId
  } = props;

  const [areaType, setAreaType] = useState('country');
  const [searchValue, setSearchValue] = useState('');

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
          <HeadlineTabs>
            {['country', 'region'].map((t) => (
              <Headline
                key={t}
                disabled={areaType !== t}
                onClick={() => setAreaType(t)}
              >
                Select {t[0].toUpperCase() + t.slice(1)}
              </Headline>
            ))}
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
          size={areaType === 'country' ? 'small' : 'large'}
          onClick={() => {
            setShowSelectAreaModal(false);
            setSelectedAreaId(area.id);
          }}
        />
      )}
    />
  );
}

ModalSelectArea.propTypes = {
  areas: T.array,
  selectedResource: T.string,
  showSelectAreaModal: T.bool,
  setShowSelectAreaModal: T.func,
  setSelectedAreaId: T.func
};

export default ModalSelectArea;
