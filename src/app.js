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
    aa = [562915,6368343];
	bb = [624379, 6076707];
  
  var projectionCords = d3.geoMercator();
          
  
  console.log(projection(aa));

    //Add markers to map based on coordinates
  // add circles to svg
    svg.selectAll("circle")
		.data([aa]).enter()
		.append("circle")
		.attr("cx", function (d) { return projectionCords(d)[0]; })
		.attr("cy", function (d) { return projectionCords(d)[1]; })
		.attr("r", "8px")
		.attr("fill", "red")  

});