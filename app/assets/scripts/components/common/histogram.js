import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { panelSkin } from '../../styles/skins';
import Button from '../../styles/button/button';
import Heading from '../../styles/type/heading';
import * as d3 from 'd3';

const HistogramWrapper = styled.div`
  ${panelSkin()};
  position: relative;
  display: grid;
  grid-template-rows: 1fr 4fr;
  min-width: 0;

  svg {
    display: block;
    width: 100%;
    height: 5rem;
  }
`;
const HistogramChart = styled.div`
`;
const HistogramHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`;
const SortToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
`;
function Histogram (props) {
  const { data, xProp, sortingProps } = props;
  const container = useRef();
  const initChart = () => {
    if (!container.current) return;
    const margin = { top: 10, right: 10, bottom: 2, left: 25 };
    const width = container.current.offsetWidth - margin.left - margin.right;
    const height = 60 - margin.top - margin.bottom;
    const svg = d3.select(container.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[xProp])])
      .range([0, width]);
    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x)
        .tickValues(x.domain())
        .tickFormat(d3.format('~s'))
      );

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d.lcoe)]);

    svg.append('g')
      .call(d3.axisLeft(y).tickValues(y.domain()));

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')

      .attr('x', function (d) { return x(d.zone_output); })
      .attr('width', 2)
      .attr('y', function (d) { return y(d.lcoe); })
      .attr("height", function(d) { return height - y(d.lcoe); })
    /*  .attr("height", function(d) { return height - y(d.value); });
      .attr('x', 1)
      .attr('transform', function (d) { return 'translate(' + x(d.x0) + ',' + y(d.length || 0) + ')'; })
      .attr('width', function (d) { return x(d.x1) - x(d.x0) - 1; })
      .attr('height', function (d) { return height - y(d.length); })
      */
      .attr('fill', d => {
        return d.color;
      });
  };

  useEffect(initChart, [container]);

  return (
    <HistogramWrapper>
      <HistogramHeader>
        <Heading>Zone Histogram</Heading>
        <SortToggle>
          <Heading>Sort by:</Heading>
          {sortingProps.map(p => (
            <Button
              key={p}
              variation='base-plain'
              size='small'
            >
              {p.replace(/-/g, ' ')}
            </Button>
          ))}
        </SortToggle>

      </HistogramHeader>

      <HistogramChart ref={container} />
    </HistogramWrapper>
  );
}

export default Histogram;
