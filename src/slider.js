
var data = d3.range(800).map(Math.random);


  var margin = {top: 194, right: 50, bottom: 214, left: 50},
    width = 1200,
    height = 800;
    
   var svgSlider = d3.select("#slider").append("g")
      .attr("width", 1200)
      .attr("height", 800)
      .attr("viewBox", "0 0 900 800")
	  .attr("preserveAspectRatio", "xMidYMid")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().range([0, width]),
    y = d3.randomNormal(height / 2, height / 8);

var brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("start brush end", brushmoved);

svgSlider.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

var circle = svgSlider.append("g")
    .attr("class", "circle")
  .selectAll("circle")
  .data(data)
  .enter().append("circle")
    .attr("transform", function(d) { return "translate(" + x(d) + "," + y() + ")"; })
    .attr("r", 3.5);

var gBrush = svgSlider.append("g")
    .attr("class", "brush")
    .call(brush);

var handle = gBrush.selectAll(".handle--custom")
  .data([{type: "w"}, {type: "e"}])
  .enter().append("path")
    .attr("class", "handle--custom")
    .attr("fill", "#666")
    .attr("fill-opacity", 0.8)
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr("cursor", "ew-resize")
    .attr("d", d3.arc()
        .innerRadius(0)
        .outerRadius(height / 2)
        .startAngle(0)
        .endAngle(function(d, i) { return i ? Math.PI : -Math.PI; }));

gBrush.call(brush.move, [0.3, 0.5].map(x));

function brushmoved() {
  var s = d3.event.selection;
  if (s == null) {
    handle.attr("display", "none");
    circle.classed("active", false);
  } else {
    var sx = s.map(x.invert);
    circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });
    handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + height / 2 + ")"; });
  }
}