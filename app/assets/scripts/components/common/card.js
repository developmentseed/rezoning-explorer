import React from 'react';
import styled from 'styled-components';
import { Link, Figure } from 'react-router-dom';

const CardWrapper = styled.article`
`;
const CardThumb = styled.div`
`;

const CardImage = styled.img`
`;

function Card (props) {
  return (
    <CardWrapper>
      <Figure
        as={Link}
      >
        <CardThumb>
          <CardImage />
        </CardThumb>
      </Figure>
    </CardWrapper>
  );
}
export default Card;
/*

const CountryCard = ({ iso, name }) => {
  return (
    <article className='card card--sumary card--country'>
      <Link
        to={`/countries/${iso}/models`}
        className='card__contents'
        title={`Select ${name}`}
      >
        <figure className='card__media'>
          <div className='card__thumb'>
            <img
              width='640'
              height='480'
              src={`/assets/graphics/content/flags-4x3/${iso}.svg`}
              alt='Country flag'
            />
          </div>
        </figure>
        <header className='card__header'>
          <h1 className='card__title'>{name}</h1>
        </header>
      </Link>
    </article>
  );
};
*/
