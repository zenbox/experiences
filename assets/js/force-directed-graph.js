!(function () {
  'use strict';
  // - - - - - - - - - -
  // declaration
  // - - - - - - - - - -
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
    setYAxis = undefined,
    color, simulation, link, node, group, groupData, nest;

  // - - - - - - - - - -
  // head section
  // - - - - - - - - - -
  canvas = {
    width: 1200,
    height: 800,
    viewbox: {
      x: 0,
      y: 0,
      width: 800,
      height: 500
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

  color = d3.scaleOrdinal(d3.schemeCategory10);

  // - - - - - - - - - -
  // functions
  // - - - - - - - - - -
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

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3)
      .restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  function ticked() {
    if (link) {
      link
        .attr('x1', function (d) {
          return d.source.x;
        })
        .attr('y1', function (d) {
          return d.source.y;
        })
        .attr('x2', function (d) {
          return d.target.x;
        })
        .attr('y2', function (d) {
          return d.target.y;
        });
    }
    if (group) {
      group.attr('transform', function (d, i) {
        return 'translate(' + d.x + ',' + d.y + ') rotate(0) scale(1)'
      });
    }
  }
  // - - - - - - - - - -
  // control
  // - - - - - - - - - -
  setCanvas('#diagram');
  // setXAxis();
  // setYAxis();

  d3.json('assets/data/miserables.json')
    .then(function (graph) {

      // - - - - - - - - - -
      // nesting data
      // - - - - - - - - - -
      // sort links by source (name)
      var graphLinksBySource = d3.nest()
        .key(function (d) {
          return d.source;
        })
        .entries(graph.links);

      console.log(graphLinksBySource);

      // count links per name
      // and save as object
      var graphLinksCount = d3.nest()
        .key(function (d) {
          return d.source;
        })
        .rollup(function (v) {
          return v.length;
        })
        .object(graph.links); //.entries(graph.links);

      console.log(graphLinksCount);
      // - - - - - - - - - -

      simulation = d3.forceSimulation()
        .force('link', d3.forceLink()
          .id(function (d) {
            return d.id;
          })
          .distance(100)
        )
        .force('charge', d3.forceManyBody()
          .strength(-100)

        )
        // .force('charge', function () {
        //   return d3.forceManyBody();
        // })
        // .force('charge', function (d) {
        //   return graphLinksCount[d.id] / 10;
        // })
        .force('center', d3.forceCenter(canvas.width / 2, canvas.height / 2));

      // building the links
      link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
          return Math.sqrt(d.value);
        });

      // building the nodes by circles
      groupData = svg.selectAll()
        .data(graph.nodes)

      group = groupData.enter()
        .append('g')
        .attr('class', 'nodes')
        .attr('transform', 'translate(' + (0) + ',' + (0) + ') rotate(0)');

      node = group
        .append('circle')
        .attr('r', function (d) {
          let r;
          if (graphLinksCount[d.id]) {
            r = graphLinksCount[d.id] * 3;
          } else {
            r = 0;
          }
          if (r < 5) r = 5;
          return r;
        })
        .attr('stroke', 'white')
        .attr('stroke-width', '2')
        .attr('fill', function (d) {
          return color(d.group);
        })
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

      // building title and text attributes
      group.append('title')
        .text(function (d) {
          return d.id;
        });

      group.append('text')
        .attr('transform', 'translate(5, 0) rotate(0)')
        .text(function (d, i) {
          return d.id;
        })

      // realtime engine
      simulation
        .nodes(graph.nodes)
        .on('tick', ticked);

      // the force is strong with you
      simulation.force('link')
        .links(graph.links);
    });
  // - - - - - - - - - -
})();