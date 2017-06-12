
     var width = 900;
      var height = 700;

      var projection = d3.geo.mercator();
      
      var svg = d3.select("#compare").append("svg")
          .attr("width", width)
          .attr("height", height);

      var path = d3.geo.path()
          .projection(projection);

      
      d3.json("../data/world.json", function(error, topology) {
          console.log(topology)
      
          var nestedData = d3.nest()
                    .key(function(d){        
                        //console.log(d.properties.name)
                          return d.properties.name;
                        })
            .map(topology.features); //Using map insted of entries to get an array of objects
    
          console.log(nestedData)
          
          svg.selectAll("path")
            .data(topojson.feature(topology, topology.object).features)
          .enter()
            .append("path")
            .attr("d", path)
          
      });