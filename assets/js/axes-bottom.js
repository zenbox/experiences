/**
 * Axes with Dynamic Data
 * @author michael
 * @since 2018/07/12
 */

!(function () {
  'use strict'
  // - - - - - - - - - -
  // declaration
  let
    dataset = [
      // x, y, r
      [5, 20, 100],
      [1300, 90, 100],
      [250, 50, 50],
      [100, 33, 320],
      [330, 95, 710]
    ],

    canvas = undefined,
    svg = undefined,
    scale = undefined,
    xScale = undefined,
    yScale = undefined,
    rScale = undefined,
    xAxis = undefined,
    yAxis = undefined,
    w = undefined,
    h = undefined,
    tx = undefined,
    ty = undefined,
    f = undefined,

    setCanvas = undefined,
    setXScale = undefined,
    setYScale = undefined,
    setRScale = undefined,
    setXAxis = undefined,
    setYAxis = undefined;

  // head section
  canvas = {
    width: 800,
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
        to: d3.max(dataset, function (d, i) {
          return d[0];
        })
      },
      range: {
        start: canvas.padding.left,
        end: canvas.width - canvas.padding.right
      }
    },
    yAxis: {
      domain: {
        from: 0,
        to: d3.max(dataset, function (d, i) {
          return d[1] + 10;
        })
      },
      range: {
        start: canvas.height - canvas.padding.bottom,
        end: canvas.padding.top
      }
    },
    radius: {
      domain: {
        from: d3.min(dataset, function (d, i) {
          return d[2];
        }),
        to: d3.max(dataset, function (d, i) {
          return d[2];
        })
      },
      range: {
        start: 5,
        end: 55
      },
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

  // process
  setCanvas('#diagram');

  xScale = d3.scaleLinear()
    .domain([scale.xAxis.domain.from, scale.xAxis.domain.to])
    .range([scale.xAxis.range.start, scale.xAxis.range.end]);

  yScale = d3.scaleLinear()
    .domain([scale.yAxis.domain.from, scale.yAxis.domain.to])
    .range([scale.yAxis.range.start, scale.yAxis.range.end]);

  rScale = d3.scaleLinear()
    .domain([scale.radius.domain.from, scale.radius.domain.to])
    .range([scale.radius.range.start, scale.radius.range.end]);

  xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5);

  yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5);

  svg.append('g')
    .attr('transform', 'translate(0, ' + (canvas.height - canvas.padding.bottom) + ')')
    .call(xAxis);

  svg.append('g')
    .attr('transform', 'translate(' + (canvas.padding.left) + ', 0)')
    .call(yAxis);

  /**
        [1300, 90], -> d
        [250, 50],
        [100, 33],
        [330, 95]
  */
  svg.selectAll()
    .data(dataset) // [[1],[2],[3],[4],[5]]
    .enter()
    .append('circle')
    .attr('cx', function (d, i) {
      // i=0: d -> [1300, 90]
      return xScale(d[0]);
    })
    .attr('cy', function (d, i) {
      return yScale(d[1]);
    })
    .attr('r', function (d, i) {
      return rScale(d[2]);
    });

  // - - - - - - - - - -
}())