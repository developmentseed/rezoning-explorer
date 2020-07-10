import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';

const CardWrapper = styled.article`
  height: ${({ size }) => size === 'large' ? '50px' : '15px'}
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 100px;
`;

const CardMedia = styled.figure`
`;
const CardThumb = styled.div`
    min-width: 4rem;
`;
const CardIcon = styled.img`
      width: 3rem;
      height: 2.5rem;

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

const CardListWrapper = styled.ol`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

function CardList ({ data, renderItem }) {
  return (
    <CardListWrapper>
      {data.map(renderItem)}
    </CardListWrapper>
  );
}

CardList.propTypes = {
  data: T.array,
  renderItem: T.func
};

export default CardList;
