import React from 'react';
import styled, { css } from 'styled-components';

function fillStyles () {
  let styles = '';
  for (let i = 0; i <= 5; i += 1) {
    styles += `
      #zone${i}-fill {
        animation-delay: calc(${i} * 0.5s);
        animation-duration: calc(${i} * 1s);
        animation-name: pulse;
        animation-timing-function: ease;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        opacity: 0;
        mix-blend-mode: screen;
        box-shadow: 4px 4px 20px rgba(0,0,0,0.4);
      }
    `;
  }
  return css`${styles}`;
}

function strokeStyles () {
  let styles = '';
  for (let i = 0; i <= 5; i += 1) {
    styles += `
      #zone${i}-stroke {
        stroke-dasharray: 2000;
        stroke-dashoffset: 2000;
        animation-delay: calc(${i} * 0.5s);
        animation-duration: calc(${i} * 3s);
        animation-name: dash, fade;
        animation-timing-function: ease;
        animation-direction: alternate;
        fill: none;
        mix-blend-mode: screen;
        stroke-width: 4;
      }
    `;
  }
  return css`${styles}`;
}
const StyledSvg = styled.svg`
  max-width: 100%;
  position: absolute;
  right: 12vw;
  bottom: 6vw;
  ${fillStyles()}
  ${strokeStyles()}
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes pulse {
    to {
      opacity: 1;
    }
  }
  @keyframes fade {
    to {
      opacity: 0;
    }
  }
`;
function HomeBackground () {
  return (
    <StyledSvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
      <g id='zones'>
        <path id='zone4-fill' fill='#004F8F' d='M0 0h398v398H0z' />
        <path id='zone4-stroke' stroke='#C0E2FF' d='M2 2h394v394H2z' />
        <path id='zone3-fill' fill='#003764' d='M202 202h398v398H202z' />
        <path id='zone3-stroke' stroke='#72A9D9' d='M204 204h394v394H204z' />
        <path id='zone2-fill' fill='#006DC6' d='M141 61h398v398H141z' />
        <path id='zone2-stroke' stroke='#399CF3' d='M143 63h394v394H143z' />
        <path id='zone1-fill' fill='#225F91' d='M61 141h398v398H61z' />
        <path id='zone1-stroke' stroke='#81C4FF' d='M63 143h394v394H63z' />
      </g>
    </StyledSvg>
  );
}

export default HomeBackground;
