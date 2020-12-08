import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { panelSkin } from '../../styles/skins';
import Heading, { headingAlt } from '../../styles/type/heading';
import SizeAwareElement from '../../components/common/size-aware-element';
import * as d3 from 'd3';
import { themeVal } from '../../styles/utils/general';
import { FormCheckable } from '../../styles/form/checkable';

const HistogramWrapper = styled(SizeAwareElement)`
  ${panelSkin()}
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
    color: ${themeVal('color.base')};
  }
  .tick {
    color: ${themeVal('color.baseAlphaD')};
    text {
      font-size: 0.75rem;
    }
  }

  .grid line, .grid path {
    stroke: ${themeVal('color.smoke')};
    stroke-opacity: 0.7;
    shape-rendering: crispEdges;
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

`;
const HistogramChart = styled.div`
/* stylelint-disable-next-line */
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
  gap: 0.5rem;
  align-items: center;
  > ${Heading} {
    ${headingAlt()}
    padding: 0.125rem 0;
  }
  ${FormCheckable} {
    font-size: 0.875rem;
    align-items: center;
  }
`;
function Histogram (props) {
  const { data, yProp, hoveredBar, onBarClick, onBarMouseOver, onBarMouseOut } = props;
  const container = useRef();

  const xPropOptions = Array.isArray(props.xProp) ? props.xProp : [props.xProp];

  const [xProp, setXProp] = useState(xPropOptions[0]);
  const initChart = () => {
    if (!container.current) return;
    const margin = { top: 5, right: 15, bottom: 20, left: 45 };
    const width = container.current.clientWidth - margin.left - margin.right;
    const height = container.current.clientHeight - margin.top - margin.bottom;

    d3.selectAll('.chart-cont').remove();
    const svg = d3.select(container.current)
      .append('svg')
      .attr('class', 'chart-cont')
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
      })
      .attr('class', 'bar')
      .attr('opacity', 0.7)
      .on('click', (e, d) => onBarClick(d))
      .on('mouseover', function (e, d) {
        onBarMouseOver(d);
        d3.select(this)
          .attr('opacity', 1);
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('opacity', 0.7);
        onBarMouseOut();
      })
    ;

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

  const setHovered = () => {
    if (!container.current) {
      return;
    }
    const svg = d3.select(container.current);
    svg.selectAll('rect')
      .attr('opacity', (d) => {
        return d.id === hoveredBar ? 1 : 0.7;
      });
  };

  useEffect(initChart, [container, xProp]);
  useEffect(setHovered, [hoveredBar]);

  return (
    <HistogramWrapper
      onChange={initChart}
    >
      <HistogramHeader>
        <Heading size='small'>Zone Histogram</Heading>
        <SortToggle>
          <Heading size='small'>Sort by:</Heading>
          {xPropOptions.map(p => (
            <FormCheckable
              key={p}
              name={p}
              id={p}
              type='radio'
              checked={p === xProp}
              onChange={() => setXProp(p)}
            >{p.replace(/_/g, ' ')}
            </FormCheckable>
          ))}
        </SortToggle>

      </HistogramHeader>

      <HistogramChart ref={container} />
    </HistogramWrapper>
  );
}

Histogram.propTypes = {
  xProp: T.oneOfType([T.string, T.array]).isRequired,
  data: T.array.isRequired,
  yProp: T.string.isRequired,
  hoveredBar: T.string,
  onBarClick: T.func,
  onBarMouseOver: T.func,
  onBarMouseOut: T.func
};

export default Histogram;
