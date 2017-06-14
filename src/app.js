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
  
  svg.selectAll("path")
    .data(topojson.feature(map, map.objects.denmarktopo).features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", "#575757")
      .style("stroke-width", "2.5");
  
  
  //http://bl.ocks.org/zanarmstrong/a40f50dc6a16844d5346
  //http://bl.ocks.org/phil-pedruco/7745589
  
    //add circular points from centriod 
    /*groups.each(function(d,i){
        
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
      
    })
    */
  
  // fake cordinate points
    a = [10.048482,57.453396];
	b = [10.935943,54.822046];
    c =[8.462128,55.3937]
    d = [8.88405,56.366219]
    
    //https://github.com/proj4js/proj4js
    var utm = "+proj=utm +zone=32";
    var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    
  console.log(proj4(utm,wgs84,[6246846,492837]));
  
  var projectionCords = d3.geoMercator();
          
  
  console.log(c[0],c[1]);

    //Add markers to map based on coordinates
  // add circles to svg
    var circles = svg.selectAll("circle")
		.data([a,b,c,d]).enter()
		.append("circle")
		.attr("cx", function (d) { return projection(d)[0]; })
		.attr("cy", function (d) { return projection(d)[1]; })
		.attr("r", "10px")
        .style("fill","steelblue")
        .style("fill-opcity", "0.7")
        .style("stroke", "#cccccc")
      	.style("stroke-width", "2.5");
    

});