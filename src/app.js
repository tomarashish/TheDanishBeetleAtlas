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


d3.json("../data/denmark.topo.json", function(error, map) {

  	console.log(map)
  
  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(map, map.objects.denmarktopo).features)
    .enter().append("path")
      .attr("d", path)
    .style("fill", "none")
    .style("stroke", "#575757")
      	.style("stroke-width", "2.5");

	});