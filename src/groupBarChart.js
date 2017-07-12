// set the dimensions and margins of the graph
var margin = {top: 250, right: 10, bottom: 30, left: 70},
    widthBar = 550 - margin.left - margin.right,
    heightBar = 750 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, widthBar])
          .padding(0.1);

var y = d3.scaleLinear()
          .range([heightBar, 0]);
   
var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x);

var data;

var categorical = [
  { "name" : "schemeAccent", "n": 8},
  { "name" : "schemeDark2", "n": 8},
  { "name" : "schemePastel2", "n": 8},
  { "name" : "schemeSet2", "n": 8},
  { "name" : "schemeSet1", "n": 9},
  { "name" : "schemePastel1", "n": 9},
  { "name" : "schemeCategory10", "n" : 10},
  { "name" : "schemeSet3", "n" : 12 },
  { "name" : "schemePaired", "n": 12},
  { "name" : "schemeCategory20", "n" : 20 },
  { "name" : "schemeCategory20b", "n" : 20},
  { "name" : "schemeCategory20c", "n" : 20 }
]


// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svgBarChart = d3.select("#barChart").append("svg")
    .attr("width", widthBar + margin.left + margin.right)
    .attr("height", heightBar + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

//var colorScale =  d3.scaleOrdinal(d3.schemeCategory20b);
var colorScale =  d3.scaleOrdinal()
   .range(['#0c6ebb', "#6b486b",  "#d0743c"]);

// get the data
d3.csv("../data/bardata.csv", function(error, _data) {
  if (error) throw error;

  // format the data
  _data.forEach(function(d) {
    d.Families = +d.Families;
    d.Species = +d.Species;
  });

  data = _data;
  
  drawChart()

});

function drawChart(){
   
   // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.Years; }));
   y.domain([0, d3.max(data, function(d) { return +d.Families; })]);

  // append the rectangles for the bar chart
  svgBarChart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Years); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.Families); })
      .attr("height", function(d) { return heightBar - y(d.Families); })
      .attr("fill", function(d,i){
          return colorScale(i)
      });

  // add the x Axis
  svgBarChart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + heightBar + ")")
      .call(xAxis);

  // add the y Axis
  svgBarChart.append("g")
  .attr("class", "axis")
    .attr("y", y(y.ticks().pop()) + 0.5)
  .attr("dy", "0.32em")
      .call(yAxis);
}

d3.select("#species").on("click", function(){
 // d3.select("#species").attr("class", "active");
  
  y.domain([0, d3.max(data, function(d) { return d.Species; })]);
  
   svgBarChart.selectAll(".bar")
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("y", function(d) { return y(d.Species); })
      .attr("height", function(d) { return heightBar - y(d.Species); })
      .attr("fill", function(d,i){
          return colorScale(i)
      });
  
  //update y axis
  svgBarChart
    .transition()
      .attr("class", "axis")
      .call(yAxis);
  
  svgBarChart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + heightBar + ")")
      .call(xAxis);
  
    })

d3.select("#family").on("click", function(){
    
  y.domain([0, d3.max(data, function(d) { return d.Families; })]);
  
   svgBarChart.selectAll(".bar")
    .transition()
    .attr("y", function(d) { return y(d.Families); })
      .attr("height", function(d) { return heightBar - y(d.Families); })
      .attr("fill", function(d,i){
          return colorScale(i)
      });
  
  //update y axis 
   svgBarChart
    .transition()
   .attr("class", "axis")
      .call(yAxis);
  
  svgBarChart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + heightBar + ")")
      .call(xAxis);
  
  
    })