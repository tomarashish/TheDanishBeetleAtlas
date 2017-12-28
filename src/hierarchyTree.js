/**
 * inspiration from
 * http://bl.ocks.org/mbostock/4339083
 */

hierarchyViewer = function module() {

  /* var tree = d3.layout.tree()
    .size([0, 250])
    .children(function (d) {
      return d.values; //change araay values to children attribute
    })
  // .value(function (d) {
  // return d.key;
  // });
  //.sort(d3.ascending);
*/
  var margin = {
      top: 50,
      right: 20,
      bottom: 30,
      left: 20
    },
    width = 600 - margin.left - margin.right,
    height = 50000 - margin.top - margin.bottom,
    barHeight = 50,
    barWidth = width * .5;

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

  // Custom color category 
  var color = d3.scaleOrdinal().range(["#8dd3c7", "#1f78b4", "#e5c494", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#bc80bd", "#ccebc5", "#ffed6f", "#b15928"]);

  function exports(_selection) {
    _selection.each(function (_data) {

      svg = d3.select('body').select("#" + this.id)
        .append("svg")
        .attr("id", this.id + "Svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Append a group which holds all nodes and which the zoom Listener can act upon.
      svgGroup = svg.append("g").attr("id", this.id + "SvgGroup");


      //root = _data;
      root = d3.hierarchy(_data, function (d) {
          return d.values;
        })
        .sum(function (d) {
          return 1;
        });

      root.x0 = 0;
      root.y0 = 0;


      collapseAll(root)
      expand(root);

      update(root);
      chartObj.push(this);

    }) //end of selections
  } //end of exports

  function update(source) {

    nodes = root.descendants();

    //nodes.filter(function (d) {

    //})

    var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

    d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);

    d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

    // Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
    var index = -1;

    root.eachBefore(function (n) {
      n.x = ++index * barHeight;
      n.y = n.depth * 40;
    });



    // Update the nodes…
    var node = svgGroup.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });


    nodeEnter = node.enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .style("opacity", 1);

    /*/append circle
        nodeEnter.append("circle")
          .attr('class', 'nodeCircle')
          .attr("r", 0)
          .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
          });
    */

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("x", 5)
      .attr("rx", "20px")
      .attr("ry", "20px")
      .attr("height", barHeight - 1)
      .attr("width", barWidth - 30)
      .style("fill", getColor)
      .on("click", click);

    nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .style("font-size", "22px")
      //.style("font-weight", "bold")
      .text(function (d) {
        return d.data.key;
      });

    nodeEnter.select('text')
      .attr('class', 'nodeText')
      .text(function (d) {
        if (d.children) {
          if (d.data.key)
            return ' - ' + d.data.key;
          else
            return ' - ' + 'unclassified';
        } else if (d._children) {
          if (d.data.key)
            return ' + ' + d.data.key;
          else
            return ' + ' + 'unclassified';
        } else {
          return d.data.key;
        }
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
      .style("fill", getColor);

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
      .data(root.links(), function (d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .style("fill", "none")
      .style("stroke", "grey")
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


  function centerNode(source, divId) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + width / 8;
    y = y * scale + height / 2;

  }
  // Collapse the node and all it's children
  function collapse(d) {
    if (d.children) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
    }
  }

  // Toggle children on click.
  function click(d) {

    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    //collapseAll(root)
    //expand(d)
    update(d);
    //centerNode(newPath, obj.id);

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
      local_i = 2;
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

  // Function to get same color for child based on color of parent. 
  // Using d3.hsl as color palette
  function getColor(d) {

    var fadeColor = 1;

    while (d.depth > 6) {
      d = d.parent;
    }
    var c = d3.lab(color(d.data.key))
    //.brighter();
    return c;
  }
  // Define the zoom function for the zoomable tree

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

  exports.enableDrag = function (_) {
    if (!arguments.length) return enableDrag;
    enableDrag = _;
    return exports;
  }

  //d3.rebind(exports, dispatch, "on");
  return exports;
} //end of module
