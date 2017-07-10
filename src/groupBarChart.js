function rightRoundedRect(x, y, width, height, radius) {
  return "M" + x + "," + (y + height)
       + "h" + width
       //+ "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
       + "v" + ( - (height - 2 * radius))
       + "a" + radius + "," + radius + " 0 0 0 " + -radius + "," + -radius
       + "h" + (- (width - 2 * radius))
  		 + "a" + radius + "," + radius + " 1 0 0 " + -radius + "," + radius
       + "z";
}

 var margin = {top: 100, right: 20, bottom: 50, left: 40},
    width = 750 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

var svgBarChart = d3.select("#barChart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 960 750")
	.attr("preserveAspectRatio", "xMidYMid");   
    
var gBarChart = svgBarChart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width]) 
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(['#0c6ebb', '#11bce8', '#9beffa', "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("../data/bardata.csv", function(d, i, columns) {
  
  console.log(d);
  
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.Years; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  gBarChart.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Years) + ",0)"; })
    .selectAll("path")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter()
  		.append('path')
  		.attr('d', function(d) {
    		return rightRoundedRect(x1(d.key), y(d.value), x1.bandwidth(), height - y(d.value), 4);
  		})
      .attr("fill", function(d) { return z(d.key); });

  gBarChart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  gBarChart.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

  var legend = gBarChart.append("g")
  .attr("class", "barlegend")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("text-anchor", "end")
  .style("fill", "#000")
      .attr("transform", function(d, i) { return "translate(100," + i * 30 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});
