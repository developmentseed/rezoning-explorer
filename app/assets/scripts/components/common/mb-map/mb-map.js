import React, { useEffect, useState, useRef, useContext } from 'react';
import T from 'prop-types';
import styled, { withTheme } from 'styled-components';
import mapboxgl from 'mapbox-gl';
import config from '../../../config';
import { glsp } from '../../../styles/utils/theme-values';
import GlobalContext from '../../../context/global-context';

mapboxgl.accessToken = config.mbToken;
localStorage.setItem('MapboxAccessToken', config.mbToken);

const MapsContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  /* Styles to accommodate the partner logos */
  .mapboxgl-ctrl-bottom-left {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    > .mapboxgl-ctrl {
      margin: 0 ${glsp(0.5)} 0 0;
    }
  }
  .partner-logos {
    display: flex;
    img {
      display: block;
      height: 3rem;
    }
    a {
      display: block;
    }
    > *:not(:last-child) {
      margin: 0 ${glsp(0.5)} 0 0;
    }
  }
`;

const SingleMapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const initializeMap = ({ setMap, mapContainer }) => {
  const map = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 0],
    zoom: 5
  });

  map.on('load', () => {
    setMap(map);
    map.resize();
  });
};

function MbMap (props) {
  const { triggerResize } = props;
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  useEffect(() => {
    if (map) {
      map.resize()
      console.log(triggerResize)
    }
  }, [triggerResize]);


  return (
    <MapsContainer>
      <SingleMapContainer
        ref={mapContainer}
      />
    </MapsContainer>
  );
}

export default MbMap;
