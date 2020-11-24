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
        animation-direction: forwards;
        fill: none;
        mix-blend-mode: screen;
        stroke-width: 4;
      }
    `;
  }
  return css`${styles}`;
}
const StyledSvg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
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
    <StyledSvg xmlns='http://www.w3.org/2000/svg' viewbox='0 0 1440 1024' preserveAspectRatio='xMaxYMin meet'>
      <g id='home-bg' stroke='none' fill='none'>
        <g id='zones'>
          <rect id='zone4-fill' fill='#004F8F' x='0' y='0' width='400' height='400' />
          <rect id='zone4-stroke' stroke='#C0E2FF' x='2' y='2' width='396' height='396' />
          <rect id='zone3-fill' fill='#003764' x='200' y='200' width='400' height='400' />
          <rect id='zone3-stroke' stroke='#72A9D9' x='202' y='202' width='396' height='396' />
          <rect id='zone2-fill' fill='#006DC6' x='140' y='60' width='400' height='400' />
          <rect id='zone2-stroke' stroke='#399CF3' x='142' y='62' width='396' height='396' />
          <rect id='zone1-fill' fill='#225F91' x='60' y='140' width='400' height='400' />
          <rect id='zone1-stroke' stroke='#81C4FF' x='62' y='142' width='396' height='396' />
        </g>
      </g>
    </StyledSvg>
  );
}

export default HomeBackground;
