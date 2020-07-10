import React from 'react';
import styled from 'styled-components';
import ShadowScrollbar from '../common/shadow-scrollbar';
import T from 'prop-types';

const CardWrapper = styled.article`
  height: ${({ size }) => size === 'large' ? '100px' : '15px'};
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

export const Card = ({ title, iconPath, size }) => {
  return (
    <CardWrapper
      size={size}
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

function CardList ({ data, renderItem }) {
  return (
    <CardListWrapper>
      <CardListContainer>
        {data.map(renderItem)}
      </CardListContainer>
    </CardListWrapper>
  );
}

CardList.propTypes = {
  data: T.array,
  renderItem: T.func
};

export default CardList;
