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
`;
function Histogram (props) {
  const { data } = props;
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
      .domain([0, d3.max(data, d => d.zone_output)])
      .range([0, width]);
    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x)
      );

    const histogram = d3.histogram()
      .value(function (d) { return d.zone_output; })
      .domain(x.domain())
      .thresholds(x.ticks(70));

    const bins = histogram(data);

    const y = d3.scaleLinear()
      .range([height, 0]);
    y.domain([0, d3.max(bins, function (d) { return d.length; })]);
    svg.append('g')
      .call(d3.axisLeft(y).tickArguments([1, '']));

    svg.selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', 1)
      .attr('transform', function (d) { return 'translate(' + x(d.x0) + ',' + y(d.length || 0) + ')'; })
      .attr('width', function (d) { return x(d.x1) - x(d.x0) - 1; })
      .attr('height', function (d) { return height - y(d.length); })
      .attr('fill', d => {
        return d[0] ? d[0].color : '#000000';
      });
  };

  useEffect(initChart, [container]);

  return (
    <HistogramWrapper>
      <HistogramHeader>
        <Heading>Zone Histogram</Heading>
        <SortToggle>
        Sort By:
          <Button
            variation='base-plain'
            size='small'
          >Zone Score
          </Button>
          <Button
            variation='base-plain'
            size='small'

          >LCOE
          </Button>
        </SortToggle>

      </HistogramHeader>

      <HistogramChart ref={container} />
    </HistogramWrapper>
  );
}

export default Histogram;
