import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { panelSkin } from '../../styles/skins';
import Button from '../../styles/button/button';
import Heading, { Subheading, headingAlt } from '../../styles/type/heading';
import SizeAwareElement from '../../components/common/size-aware-element';
import * as d3 from 'd3';
import { themeVal } from '../../styles/utils/general';

const HistogramWrapper = styled(SizeAwareElement)`
  ${panelSkin()};
  position: relative;
  display: grid;
  grid-template-rows: 1fr 5fr;
  min-width: 0;
  padding: 0.5rem;

  svg {
    display: block;
    width: 100%;
  }

  .axis-label {
    ${headingAlt()}
    font-size: 0.5rem;
    color: ${themeVal('color.baseAlphaD')};
  }
  .tick {
    color: ${themeVal('color.baseAlphaD')};
  }

  #y-axis path {
    display: none;
  }
  #x-axis .tick:first-child{
    text-anchor: start;
  }

  #x-axis .tick:last-child{
    text-anchor: end;
  }

  .grid line, .grid path{
    stroke: ${themeVal('color.smoke')};
    stroke-opacity: 0.7;
    shape-rendering: crispEdges;
  }
`;
const HistogramChart = styled.div`
`;
const HistogramHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  text-transform: uppercase;
  align-items: baseline;
  > ${Heading} > {
    padding: 0.125rem 0;
  }
`;
const SortToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  > ${Heading} {
    ${headingAlt()}
    padding: 0.125rem 0;
  }
`;
function Histogram (props) {
  const { data, yProp, sortingProps } = props;
  const container = useRef();

  const [xProp, setXProp] = useState(sortingProps[0]);
  const initChart = () => {
    if (!container.current) return;
    const margin = { top: 5, right: 15, bottom: 20, left: 35 };
    const width = container.current.clientWidth - margin.left - margin.right;
    const height = container.current.clientHeight - margin.top - margin.bottom;

    d3.selectAll('svg').remove();
    const svg = d3.select(container.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[xProp]) * 1.01])
      .range([0, width]);

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'tick-labels')
      .attr('class', 'grid')
      .attr('id', 'x-axis')
      .call(d3.axisBottom(x)
        .tickValues(x.domain())
        .tickFormat(d3.format('.1s'))
        .tickSize(0)
      );
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisTop(x).tickValues([]).tickSize(0)
      );

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d[yProp])]);

    svg.append('g')
      .attr('class', 'tick-labels')
      .attr('class', 'grid')
      .attr('id', 'y-axis')
      .call(d3.axisLeft(y).tickValues(y.domain()).tickSize(0));

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function (d) { return x(d[xProp]); })
      .attr('width', 10)
      .attr('y', function (d) { return y(d[yProp]); })
      .attr('transform', 'translate(-5, 0)')
      .attr('height', function (d) { return height - y(d.lcoe); })
      .attr('fill', d => {
        return d.color;
      });

    svg.append('text')
      .attr('transform',
        'translate(' + (width / 2) + ' ,' +
          (height + margin.top + margin.bottom / 2) + ')')
      .style('text-anchor', 'middle')
      .attr('class', 'axis-label')
      .text(xProp.replace(/_/g, ' '));

    svg.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(yProp.replace(/_/g, ' '));

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x)
        .ticks(10)
        .tickSize(-height)
        .tickFormat('')
      );
  };

  useEffect(initChart, [container, xProp]);

  return (
    <HistogramWrapper
      onChange={initChart}
    >
      <HistogramHeader>
        <Heading size='small'>Zone Histogram</Heading>
        <SortToggle>
          <Heading size='small'>Sort by:</Heading>
          {sortingProps.map(p => (
            <Button
              key={p}
              variation='base-plain'
              size='small'
              visuallyDisabled={p === xProp}
              onClick={() => setXProp(p)}
            >
              {p.replace(/_/g, ' ')}
            </Button>
          ))}
        </SortToggle>

      </HistogramHeader>

      <HistogramChart ref={container} />
    </HistogramWrapper>
  );
}

export default Histogram;
