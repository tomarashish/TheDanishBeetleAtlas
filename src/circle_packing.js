circlePack = function module() {


  var svg, margin = 20,
    root, node, circle,
    focus, nodes, view,
    diameter = 700;

  var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(15,80%,77%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(10);

  function exports(_selection) {
    _selection.each(function (_data) {

      root = d3.hierarchy(_data, function (d) {
        return d.values;
      });

      focus = root;
      nodes = pack(root).descendants();

      // Add the svg canvas
      svg = d3.select(this).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr('viewBox', '0 0 ' + Math.min(diameter, diameter) + ' ' + Math.min(diameter, diameter))
        .attr('preserveAspectRatio', 'xMinYMin')
        .append("g")
        .attr("transform", "translate(" + (diameter / 2) + "," + (diameter / 2) + ")");

      update(root);

    }) //end of selection

  } //end of exports

  function update(root_data) {

    circle = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("class", function (d) {
        return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
      })
      .style("fill", function (d) {
        return d.children ? color(d.depth) : null;
      })
      .on("click", function (d) {
        if (focus !== d) zoom(d), d3.event.stopPropagation();
      });


    var text = svg.selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function (d) {
        return d.parent === root ? 1 : 0;
      })
      .style("display", function (d) {
        return d.parent === root ? "inline" : "none";
      })
      .text(function (d) {
        return d.data.name;
      });

    node = svg.selectAll("circle,text")
      .style("background", color(-1))
      .on("click", function () {
        zoom(root);
      });
    console.log(root_data)
    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoomTo(v) {
      var k = diameter / v[2];
      view = v;
      node.attr("transform", function (d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
      });
      circle.attr("r", function (d) {
        return d.r * k;
      });
    } //end of zoomTo

  } //end of update

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function (d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function (t) {
          zoomTo(i(t));
        };
      });

    transition.selectAll("text")
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function (d) {
        return d.parent === focus ? 1 : 0;
      })
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }



  return exports;
} //end of module
