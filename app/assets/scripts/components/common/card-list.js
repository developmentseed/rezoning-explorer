import React from 'react';
import styled from 'styled-components';
import ShadowScrollbar from '../common/shadow-scrollbar';
import T from 'prop-types';

const CardWrapper = styled.article`
  height: ${({ size }) => size === 'large' ? '5rem' : '3rem'};
  display: flex;
  flex-direction: row;
  justify-content:start;
`;

const CardMedia = styled.figure`
`;
const CardThumb = styled.div`
  min-width: 4rem;
`;
const CardIcon = styled.img`
  height: 100%;
`;
const CardTitle = styled.h4`
`;

export const Card = ({ title, iconPath, size, onClick }) => {
  return (
    <CardWrapper
      size={size}
      onClick={onClick}
    >
      <CardMedia>
        <CardThumb>
          <CardIcon
            src={iconPath}
          />
        </CardThumb>
      </CardMedia>
      <CardTitle>{title}</CardTitle>
    </CardWrapper>
  );
};

Card.propTypes = {
  title: T.string,
  iconPath: T.string,
  size: T.oneOf(['small', 'large'])
};

const CardListWrapper = styled(ShadowScrollbar)`
  height: 60vh;
`;
const CardListContainer = styled.ol`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2.5rem;
`;

function CardList ({ data, renderCard, filterCard = () => true }) {
  return (
    <CardListWrapper>
      <CardListContainer>
        { data
          .filter(filterCard)
          .map(renderCard)
        }
      </CardListContainer>
    </CardListWrapper>
  );
}

CardList.propTypes = {
  data: T.array,
  renderCard: T.func,
  filterCard: T.func,
  onClick: T.func
};

export default CardList;
