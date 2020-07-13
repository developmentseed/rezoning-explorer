import React from 'react';
import styled from 'styled-components';
import ShadowScrollbar from '../common/shadow-scrollbar';
import T from 'prop-types';

import { truncated } from '../../styles/helpers/index';
import { themeVal } from '../../styles/utils/general';

const CardWrapper = styled.article`
  height: ${({ size }) => (size === 'large' ? '5rem' : '3.5rem')};
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  border: 1px solid ${themeVal('color.baseAlphaC')};

  box-shadow: 0 0 32px 2px ${themeVal('color.baseAlphaA')},
    0 16px 48px -16px ${themeVal('color.baseAlphaB')};

  cursor: pointer;

  &:hover {
    box-shadow: 0 0 32px 4px ${themeVal('color.baseAlphaA')},
      0 16px 48px -8px ${themeVal('color.baseAlphaB')};
    transform: translate(0, -0.125rem);
  }
`;

const CardMedia = styled.figure`
  display: flex;
  margin: 0.5rem;
  margin-right: 0;
`;
const CardIcon = styled.img`
  width: 3rem;
`;
const CardTitle = styled.h4`
  ${truncated}
  padding: 1rem;
`;

export const Card = ({ title, iconPath, size, onClick }) => {
  return (
    <CardWrapper size={size} onClick={onClick}>
      <CardMedia>
        <CardIcon src={iconPath} />
      </CardMedia>
      <CardTitle>{title}</CardTitle>
    </CardWrapper>
  );
};

Card.propTypes = {
  title: T.string,
  iconPath: T.string,
  size: T.oneOf(['small', 'large']),
  onClick: T.func
};

const CardListWrapper = styled(ShadowScrollbar)`
  height: 60vh;
`;
const CardListContainer = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 2rem;
`;

function CardList ({ data, renderCard, filterCard = () => true }) {
  return (
    <CardListWrapper>
      <CardListContainer>
        {data.filter(filterCard).map(renderCard)}
      </CardListContainer>
    </CardListWrapper>
  );
}

CardList.propTypes = {
  data: T.array,
  renderCard: T.func,
  filterCard: T.func
};

export default CardList;
