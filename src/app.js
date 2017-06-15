 //https://blog.madewithenvy.com/local-maps-with-canvas-d3-38ea389fca30
//

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

var hexbin = d3.hexbin()
    .extent([[0, 0], [width, height]])
    .radius(10);

var radius = d3.scaleSqrt()
    .domain([0, 12])
    .range([0, 10]);

d3.json("../data/denmark.topo.json", function(error, map) {

  	console.log(map)
  
  svg.selectAll("path")
    .data(topojson.feature(map, map.objects.denmarktopo).features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", "#f5eede")
      //.style("stroke", "#648d9e")
      .style("stroke-width", "2px");
  
    
    //https://github.com/proj4js/proj4js
    var utm = "+proj=utm +zone=32";
    var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    
  queue()
	.defer(d3.csv, '../data/StednavneExxel.csv')
	.defer(d3.csv, '../data/BillekatalogSamlet.csv')
	.await(createMap);
  
  //create map from combined data
  function createMap(error, cordsData, speciesData ){
    console.log(cordsData[0])
    var cords = [];
    
    for( var i = 0; i < cordsData.length; i++){
      
      //console.log(proj4(utm,wgs84,[6246846,492837]));
      //console.log(proj4(utm,wgs84,[data[i].XKoord, data[i].YKoord]));
      
      cords.push(proj4(utm,wgs84,[cordsData[i].XKoord, cordsData[i].YKoord]))
    }//end of for loop
         
    
    //Add markers to map based on coordinates
  // add circles to svg
    
    var circles = svg.selectAll("circle")
		.data(cords).enter()
		.append("circle")
		.attr("cx", function (d) { return projection(d)[0]; })
		.attr("cy", function (d) { return projection(d)[1]; })
		.attr("r", "1px")
        //.style("fill","#648d9e");
        .style("fill","#00485d");
    
    
    //Add Zooming and panning
    
    /*
    //Add hexagonal bins with hovering over shows tooltip with piechart
     svg.append("g")
      .attr("class", "hexagon")
    .selectAll("path")
    .data(hexbin(cordsData).sort(function(a, b) { return b.length - a.length; }))
    .enter().append("path")
      .attr("d", function(d) { return hexbin.hexagon(radius(2)); })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      */
  }//end f cordinates csv
  
});