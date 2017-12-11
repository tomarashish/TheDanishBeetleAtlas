/**
 * inspiration from
 * http://bl.ocks.org/mbostock/4339083
 */

hierarchyViewer = function module() {

  var tree = d3.layout.tree()
    .size([0, 50])
    .children(function (d) {
      return d.values; //change araay values to children attribute
    });
  //.sort(d3.ascending);

  var margin = {
      top: 30,
      right: 20,
      bottom: 30,
      left: 20
    },
    width = 700 - margin.left - margin.right,
    height = 3000 - margin.top - margin.bottom,
    barHeight = 50,
    barWidth = width * .8;

  var i = 0,
    duration = 100,
    root, svg, svgGroup, height;

  // Calculate total nodes, max label length
  var totalNodes = 0;
  var enableDrag = true;
  var nodeEnter;
  var maxLabelLength = 0;

  // panning variables
  var panSpeed = 200;
  var panBoundary = 20; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  function exports(_selection) {
    _selection.each(function (_data) {
      console.log(_data)
      svg = d3.select('body').select("#" + this.id)
        .append("svg")
        .attr("id", this.id + "Svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Append a group which holds all nodes and which the zoom Listener can act upon.
      svgGroup = svg.append("g").attr("id", this.id + "SvgGroup");


      root = _data
      root.x0 = 0;
      root.y0 = 0;

      collapseAll(root)
      expand(root)
      update(root);

    }) //end of selections
  } //end of exports

  function update(source) {

    // Compute the flattened node list. TODO use d3.layout.hierarchy.
    var nodes = tree.nodes(root);

    //height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom );

    d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);

    d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

    // Compute the "layout".
    nodes.forEach(function (n, i) {
      n.x = i * barHeight;
    });

    // Update the nodes…
    var node = svgGroup.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id || (d.id = ++i);
      })

    nodeEnter = node.enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .style("opacity", 1);

    //append circle
    nodeEnter.append("circle")
      .attr('class', 'nodeCircle')
      .attr("r", 0)
      .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
      });


    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("x", 5)
      .attr("height", barHeight - 1)
      .attr("width", barWidth - 50)
      .style("fill", color)
      .on("click", click);

    nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .style("font-size", "22px")
      //.style("font-weight", "bold")
      .text(function (d) {
        return d.key;
      });

    node.select('text')
      .attr('class', 'nodeText')
      .text(function (d) {
        if (d.children) {
          return '- ' + d.key;
        } else if (d._children) {
          return '+ ' + d.key;
        } else {
          return d.key;
        }
      });

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
      .attr("r", 4.5)
      .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Transition nodes to their new position.
    nodeEnter.transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      })
      .style("opacity", 1);

    node.transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      })
      .style("opacity", 1)
      .select("rect")
      .style("fill", color);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .style("opacity", 1e-6)
      .remove();


    // Update the links…
    var link = svgGroup.selectAll("path.link")
      .data(tree.links(nodes), function (d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return elbow({
          source: o,
          target: o
        });
      })
      .transition()
      .duration(duration)
      .attr("d", elbow);

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", elbow)
      .style("fill", "none")
      .style("stroke", "grey")
      .style("stroke-width", "2px");

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return elbow({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  } //end of update

  function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  function centerNode(source, divId) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + width / 8;
    y = y * scale + height / 2;


    d3.select("#" + divId).select('g').transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");

    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  // Toggle children on click.
  function click(d) {

    chartObj.forEach(function (obj) {

      var newPath = getNodePath(obj.__data__, d.id);

      if (newPath.children) {

        newPath._children = newPath.children;
        newPath.children = null;
      } else {
        newPath.children = newPath._children;
        newPath._children = null;
      }

      update(obj.__data__);
      //centerNode(newPath, obj.id);

    });

  } //end of click

  // To get path of node of each chart
  // Receives two argument 1 : data obejct and
  // 2 : id to be searched i.e. clicked node
  function getNodePath(dataObj, searchId) {

    // Check for id of clicked node and current chart object data
    if (searchId === dataObj.id) {

      return dataObj;
    } else {
      if (dataObj.children) {

        for (var i = 0; i < dataObj.children.length; i++) {
          var path = getNodePath(dataObj.children[i], searchId);

          if (path) {
            return path;
          }

        }
      }
    }
  } //end of getNodePath

  function color(d) {
    return d._children ? "#c6dbef" : d.children ? "#c6dbef" : "#fd8d3c";
  }

  function elbow(d, i) {
    return "M" + d.source.y + "," + d.source.x +
      "V" + d.target.x + "H" + d.target.y;
  }

  // collapse everything
  function collapseAll(d) {
    if (d.children && d.children.length === 0) {
      d.children = null;
    }
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapseAll);
      d.children = null;
    }
  } // end of collapse function

  // Expands a node for i levels
  function expand(d, i) {
    var local_i = i;
    if (typeof local_i === "undefined") {
      local_i = 3;
    }
    if (local_i > 0) {
      if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      if (d.children) {
        d.children.forEach(function (c) {
          expand(c, local_i - 1);
        });
      }
    }
  } //end of expand function 

  // Define the zoom function for the zoomable tree

  // Function to update the temporary connector indicating dragging affiliation
  var updateTempConnector = function () {
    var data = [];

    if (draggingNode != null && selectedNode != null) {

      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      data = [{
        source: {
          x: selectedNode.y0,
          y: selectedNode.x0
        },
        target: {
          x: draggingNode.y0,
          y: draggingNode.x0
        }
            }];
    }

    var link = svgGroup.select("#basetreeSvgGroup").selectAll(".templink").data(data);

    link.enter().append("path")
      .attr("class", "templink")
      .attr("d", d3.svg.diagonal())
      .attr('pointer-events', 'none');

    link.attr("d", d3.svg.diagonal());

    link.exit().remove();
  };


  function zoom() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  function sortTree() {
    tree.sort(function (a, b) {
      return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  //sortTree();


  //export function to modules
  exports.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return exports;
  }

  exports.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return exports;
  }

  //d3.rebind(exports, dispatch, "on");
  return exports;
} //end of module
