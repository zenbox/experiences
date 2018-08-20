/**
 * Some Axes ...
 * @author Michael
 * @since 2018/07/11
 */
!(function () {
  'use strict';
  // - - - - - - - - - -
  // declaration
  let
    canvas = undefined,
    svg = undefined,
    scale = undefined,
    xScale = undefined,
    yScale = undefined,
    w = undefined,
    h = undefined,
    tx = undefined,
    ty = undefined,
    f = undefined,

    setCanvas = undefined,
    setXScale = undefined,
    setYScale = undefined,
    setXAxis = undefined,
    setYAxis = undefined;

  // head section
  canvas = {
    width: 400,
    height: 400,
    viewbox: {
      x: 0,
      y: 0,
      width: 400,
      height: 400
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    }
  }
  scale = {
    xAxis: {
      domain: {
        from: 0,
        to: 100
      },
      range: {
        start: canvas.padding.left,
        end: canvas.width - canvas.padding.right
      }
    },
    yAxis: {
      domain: {
        from: 5,
        to: 0
      },
      range: {
        start: canvas.padding.top,
        end: canvas.height - canvas.padding.bottom
      }
    }
  };

  // methods
  setCanvas = function (contextSelector) {
    svg = d3.select(contextSelector)
      .append('svg')
      .attr('width', canvas.width)
      .attr('height', canvas.height)
      .attr('viewbox', canvas.viewbox.x + ' ' + canvas.viewbox.y + ' ' + canvas.viewbox.width + ' ' + canvas.viewbox.height)
  };

  setXScale = function () {
    xScale = d3.scaleLinear()
      .domain([scale.xAxis.domain.from, scale.xAxis.domain.to])
      .range([scale.xAxis.range.start, scale.xAxis.range.end]);
  };

  setYScale = function () {
    yScale = d3.scaleLinear()
      .domain([scale.yAxis.domain.from, scale.yAxis.domain.to])
      .range([scale.yAxis.range.start, scale.yAxis.range.end]);
  };

  setXAxis = function () {
    let
      tx = 0,
      ty = canvas.height - canvas.padding.bottom;

    setXScale();

    svg.append('g')
      .attr('transform', 'translate(' + tx + ', ' + ty + ')')
      .call(d3.axisBottom(xScale));
  };

  setYAxis = function () {
    let
      tx = canvas.padding.left,
      ty = 0;

    setYScale();

    svg.append('g')
      .attr('transform', 'translate(' + tx + ', ' + ty + ')')
      .call(d3.axisLeft(yScale));
  };

  // control
  setCanvas('#diagram');
  setXAxis();
  setYAxis();
  // - - - - - - - - - -
}());