!(function () {
  'use strict';
  // - - - - - - - - - -
  // declaration
  // - - - - - - - - - -
  let
    svg, width, height, color, simulation, link, node;

  // - - - - - - - - - -
  // values
  // - - - - - - - - - -
  svg = d3.select("svg");
  width = +svg.attr("width");
  height = +svg.attr("height");
  color = d3.scaleOrdinal(d3.schemeCategory10);

  // - - - - - - - - - -
  // functions
  // - - - - - - - - - -
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
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }
  // - - - - - - - - - -
  // control
  // - - - - - - - - - -
  d3.json("assets/data/miserables.json")
    .then(function (graph) {
      simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
          .id(function (d) {
            return d.id;
          }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

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
      node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function (d) {
          return color(d.group);
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      // building title attributes
      node.append("title")
        .text(function (d) {
          return d.id;
        });

      // realtime engine
      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

      // the force is strong with you
      simulation.force("link")
        .links(graph.links);
    });
  // - - - - - - - - - -
})();