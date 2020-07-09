import React from 'react';
import styled from 'styled-components'
const CardListWrapper = styled.ol`
`;

function CardList (props) {
  return (
    <CardListWrapper>
      {props.children}
    </CardListWrapper>
  )
}

export default CardList;

/*
      <ol className='country-list card-list'>
        {countries.map(c => (
          <li key={c.id} className='country-list__item'>
            <CountryCard iso={c.id} name={c.name} />
          </li>
        ))}
      </ol>

*/
