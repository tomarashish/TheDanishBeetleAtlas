 var width = 1200,
     height = 800;

      var projection = d3.geoMercator()
	    .translate([-1000, 9350])
        .scale(7500);
      

    var path = d3.geoPath()
      .projection(projection);


var svg = d3.select("#map").append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", "0 0 900 800")
	.attr("preserveAspectRatio", "xMidYMid");


d3.json("../data/denmark-counties.json", function(error, map) {

  	console.log(map)
  
  var groups = svg.selectAll("g")
    .data(topojson.feature(map, map.objects.denmarktopo).features)
    .enter().append("g");
  
  
      groups.append("path")
      .attr("d", path)
    .style("fill", "none")
    .style("stroke", "#575757")
      	.style("stroke-width", "2.5");
  
  
    //add circular points
    groups.each(function(d,i){
        
      var center = projection(d3.geoCentroid(d)); 
      
      d3.select(this)
        .append("circle")
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", "9px")
        .style("fill","lightgrey")
        .style("fill-opcity", "0.8")
        .style("stroke", "#cccccc")
      	.style("stroke-width", "0.5");
      
      d3.select(this)
        .append("circle")
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", "5px")
        .style("fill", "steelblue")
        .style("stroke", "#575757")
        .style("stroke-width", "0.5");
      
    })

});