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
    .radius(4);

var radius = d3.scaleSqrt()
    .domain([0, 15])
    .range([0, 8]);

var div = d3.select("body") 
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

//https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
var color = d3.scaleOrdinal(d3.schemeCategory20b);


d3.json("../data/denmark.topo.json", function(error, map) {
  
  svg.selectAll("path")
    .data(topojson.feature(map, map.objects.denmarktopo).features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", "#f5eede")
      //.style("stroke", "#648d9e")
      .style("stroke-width", "2px");
    
  queue()
    .defer(d3.csv, '../data/merge_data.csv')
	.await(createMarker);
  
  //create map from combined data
  function createMarker(error, atlasData ){
  
    console.log(atlasData)
    //https://github.com/proj4js/proj4js
    var utm = "+proj=utm +zone=32";
    var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    
    var cords = [];
    
    for( var i = 0; i < atlasData.length; i++){
    //for( var i = 0; i < 100; i++){
      
      //console.log(proj4(utm,wgs84,[6246846,492837]));
      //console.log(proj4(utm,wgs84,[data[i].XKoord, data[i].YKoord]));
      if(atlasData[i].XKoord != "NA" || atlasData[i].YKoord != "NA")
        cords.push(proj4(utm,wgs84,[atlasData[i].XKoord, atlasData[i].YKoord]))
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
   // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
	// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
    
    
    //Add Zooming and panning
    
    
    /*
    //Add hexagonal bins with hovering over shows tooltip with piechart
    
    hexabinData = cords.map(function(d){
      var p = projection(d);
      d[0] = p[0], d[1] = p[1];
      
      return d;
    })
    
     svg.append("g")
      .attr("class", "hexagon")
    .selectAll("path")
    .data(hexbin(hexabinData).sort(function(a, b) { return b.length - a.length; }))
    .enter().append("path")
      .attr("d", function(d) { return hexbin.hexagon(radius(2)); })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("fill", function(d) { return color(d3.median(d, function(d,i) { return i; })); });
     
    
    
    //Adding image marker with map
    svg.selectAll(".mark")
    .data(cords)
    .enter()
    .append("image")
    .attr('class','mark')
    .attr('width', 20)
    .attr('height', 40)
    .attr("xlink:href",'data/img/beetle1.png')
    .attr("transform", function(d) {return "translate(" + projection([d[0],d[1]]) + ")";});
    */
    
    //Heatmap 
    //http://bl.ocks.org/kaijiezhou/82d0b794e845294b366e
    
  }//end f cordinates csv
  
});