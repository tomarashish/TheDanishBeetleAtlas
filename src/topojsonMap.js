var mapWidth = 800,
  mapHeight = 400;

var projection = d3.geoMercator()
  .translate([-1050, 9350])
  .scale(7500);

var showToolTip = true;

var path = d3.geoPath()
  .projection(projection);

var minYear,
  maxYear, circles, circleData, names = [];

var zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

var svgMap = d3.select("#map").append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr('viewBox', '0 0 ' + (mapHeight + 650) + ' ' + mapWidth)
  //.attr("viewBox", "0 0 970 800")
  .call(zoom)
  .attr("preserveAspectRatio", "xMidYMid")
//.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");;

var hexbin = d3.hexbin()
  .extent([[0, 0], [mapWidth, mapHeight]])
  .radius(4);

var radius = d3.scaleSqrt()
  .domain([0, 15])
  .range([0, 8]);

//d3 tooltip to display the related metadata of circle markers
var div = d3.select('body') //select tooltip div over body
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
var color = d3.scaleOrdinal(d3.schemeCategory20b);

//Inititalizing the colorBy values of the circle marker
// of the cordinates over the map. Using these value to 
// change the color of the marker using colorByCategogy function
var colorCategory = 'Distrikt';
var colorByTaxon = false,
  colorNone = false;

d3.json("./data/denmark.topo.json", function (error, map) {

  // Creating the svgmap for Denmark using denmark topology json data
  svgMap.selectAll("path")
    .data(topojson.feature(map, map.objects.denmarktopo).features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", "#f5eede")
    //.style("stroke", "#648d9e")
    .style("stroke-width", "2px");

  queue()
    .defer(d3.csv, './data/merge_data.csv')
    .await(createMarker);

  //create map from combined data
  function createMarker(error, atlasData) {

    maxYear = d3.max(atlasData, function (d) {
      return +d.DateYear;
    });
    minYear = d3.min(atlasData, function (d) {
      return +d.DateYear;
    });

    //https://github.com/proj4js/proj4js
    var utm = "+proj=utm +zone=32";
    var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    var cords = [];
    for (var i = 0; i < atlasData.length; i++) {

      //console.log(proj4(utm,wgs84,[6246846,492837]));
      //console.log(atlasData[i].XKoord, atlasData[i].YKoord);

      if (atlasData[i].XKoord != "NA" || atlasData[i].YKoord != "NA") {
        var LatLang = [];

        cords.push(proj4(utm, wgs84, [atlasData[i].XKoord, atlasData[i].YKoord]))

        atlasData[i].LatLang = proj4(utm, wgs84, [atlasData[i].XKoord, atlasData[i].YKoord]);
        //console.log("latlang present")
      }
      /* else {

              var address = atlasData[i].Lokalitet

              // Initialize the Geocoder

              setTimeout(function () {
                geocoder = new google.maps.Geocoder();
                if (geocoder) {
                  geocoder.geocode({
                    'address': address
                  }, function (results, status) {
                    console.log(status)
                    if (status == google.maps.GeocoderStatus.OK) {
                      console.log(results[0].geometry.location.lat());
                      console.log(results[0].geometry.location.lng());
                    }
                  });
                }
              }, 5000);
            }*/
    } //end of for loop

    // Making First call to the circle marker to
    // display the circle on svg map
    circleMarker(atlasData)

    //Add markers to map based on coordinates
    // add circles to svg
    function circleMarker(markerData) {

      // Variable to display names in search input field
      var taxonList = [],
        familyList = [];

      markerData.forEach(function (d) {

        if (taxonList.indexOf(d.Taxon) == -1)
          taxonList.push(d.Taxon);

        if (familyList.indexOf(d.Family) == -1)
          familyList.push(d.Family);

      });

      circleData = markerData;


      circles = svgMap.selectAll(".circle")
        .data(markerData)

      console.log(circles);

      circles.enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) {
          //if (d.LatLang) console.log(d);
          if (d.LatLang) return projection(d.LatLang)[0];
        })
        .attr("cy", function (d) {
          if (d.LatLang) return projection(d.LatLang)[1];
        })
        .attr("r", "3px")
        //.style("fill","#648d9e");
        .style("fill", function (d) {
          return color(d[colorCategory]);
        })
        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("mouseover", mouseIn)
        .on("mouseout", mouseOut);

      circles.exit()
        .transition().duration(200)
        .attr("r", "2px")
        .remove();

      // Annotate search list for Species and family input fields 
      // by passing the taxon name and family name list to awesomplete 
      // function and input field id
      searchBy(taxonList, "searchSpecies")
      searchBy(familyList, "searchFamily")

    } //end of circleMarker funtion

    // searchBy function uses the list of names 
    // and input field id. Internally calling awesomplete method 
    // to get search list of names in input list   
    function searchBy(inputList, inputId) {

      var input = document.getElementById(inputId);

      //using the awesomplete function to get input field 
      // with multiple search names
      var awesomplete = new Awesomplete(input, {
        list: inputList,

        filter: function (text, input) {
          return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
        },

        item: function (text, input) {
          return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
        },

        replace: function (text) {
          var before = this.input.value.match(/^.+,\s*|/)[0];
          this.input.value = before + text + ", ";
        }
      });

    } //end of species and family search function

    d3.select("#searchSp").on("click", getNames)

    function getNames() {
      names = document.getElementById("searchSpecies").value;

      var filterNames = atlasData.filter(function (d) {

        if (names.indexOf(d.Taxon) != -1)
          return d;
      });

      //console.log(filterNames)
      //call circlemarker with filtered data every time the slider is adjusted
      circleMarker(filterNames);
    }

    var sliderBar = sliderD3();

    var sliderContainer = d3.select("#slider")
      .datum([minYear, maxYear])
      .call(sliderBar);

    sliderBar.on("slide", function (year) {

      var filterData = atlasData.filter(function (d) {
        if (d.DateYear >= year[0] && d.DateYear <= year[1])
          return d;
      })

      //if species search button is clicked use getNames() and filter the data
      // again with the species or family names 
      //filter by species name

      //call circlemarker with filtered data every time the slider is adjusted
      circleMarker(filterData);
    }); // end of sliderbar function

    function mouseIn(d) {

      if (showToolTip == true) {
        div.transition()
          .duration(500)
          .style("opacity", 0.9);
        // the pageX and pageY value 
        var pageX = d3.event.pageX,
          pageY = d3.event.pageY;

        var speciesName = d.Taxon.replace(/\s/, '%20');
        var SpeciesUrl = "http://danbiller.dk/scripts/get_key_beetles.php?q=" +
          speciesName + "&key=species";

        // example request
        getCORS(SpeciesUrl, function (request) {
          var response = request.currentTarget.response || request.target.responseText;
          console.log(response)
          var jsonGet = JSON.parse(response);
          var getUrl, imgUrl;

          if (jsonGet[0]['Url']) {
            getUrl = jsonGet[0]['Url'];
            imgUrl = 'http://danbiller.dk' + getUrl;
          } else
            imgUrl = '/data/img/placeholder.jpg'


          div.html("Name: " + d.Taxon + '<br>' + "Family: " + d.Family + '<br>' + "Locality : " + d.Lokalitet +
              '<br>' + " District: " + d.Distrikt + '<br>' + " Year: " + d.DateYear + '<br>' + "<span ><img src = '" + imgUrl + "' height='250' width='230'></span")
            .style("font-size", "18px")
            .style("text-align", "center")
            .style("background", "#fff8dc")
            .style("color", "#000")
            .style("font-weight", "bold")
            .style("border", "2px solid")
            .style("border-color", "black")
            .style("border-radius", "3px")
            .style("left", (pageX + 10) + "px")
            .style("top", (pageY + 30) + "px");
        });

      }

    } //end of mouse in


    function getCORS(url, success) {
      var xhr = new XMLHttpRequest();
      if (!('withCredentials' in xhr)) xhr = new XDomainRequest();
      xhr.open('GET', url);
      xhr.onload = success;
      xhr.send();
      return xhr;
    }


    function mouseOut() {

      if (showToolTip == true) {
        div.transition()
          .duration(100)
          .style("opacity", 0);
      }
    } // end of mouse out


    function createToolTip(d) {

      //console.log(d);

      var imgUrl = 'http://danbiller.dk/upload/Gyrinus_minutus_F_km-779436900182068512.jpg';

      div.html("Name: " + d.Taxon + '<br>' + "Family: " + d.Family + '<br>' + "Locality : " + d.Lokalitet +
          '<br>' + " District: " + d.Distrikt + '<br>' + " Year: " + d.DateYear + '<br>' + "<span ><img src = '" + imgUrl + "' height='250' width='230'></span")
        .style("font-size", "18px")
        .style("text-align", "center")
        .style("background", "#fff8dc")
        .style("color", "#000")
        .style("font-weight", "bold")
        .style("border", "2px solid")
        .style("border-color", "black")
        .style("border-radius", "3px")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY + 30) + "px");
    }

    d3.select("#colorCategory").on("change", function () {

      var sect = document.getElementById("colorCategory");
      var section = sect.options[sect.selectedIndex].value;

      colorByCategory(section);

    });

    function colorByCategory(category) {

      colorCategory = category;

      svgMap.selectAll(".circle")
        .data(circleData)
        .style("fill", function (d, i) {
          return color(d[colorCategory])
        })
        .on("mouseover", mouseIn)
        .on("mouseout", mouseOut);
    }
    //Add Zooming and panning

    /*
                            //Add hexagonal bins with hovering over shows tooltip with piechart
      
                            hexabinData = cords.map(function(d){
                              var p = projection(d);
                              d[0] = p[0], d[1] = p[1];
                              
                              return d;
                            })
      
                             svgMap.append("g")
                              .attr("class", "hexagon")
                              .selectAll("path")
                              .data(hexbin(hexabinData).sort(function(a, b) { return b.length - a.length; }))
                              .enter().append("path")
                              .attr("d", function(d) { return hexbin.hexagon(radius(2)); })
                              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                              .attr("fill", function(d) { return color(d3.median(d, function(d,i) { return i; })); });
                                */
    /*
    //Adding image marker with map
    svgMap.selectAll(".mark")
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

  } //end cordinates csv

  //Using slider module with dispatch function to get the handle value
  // Using the handle value (Years) changing the filter to create the filtered markers


  //.on("MoveSlider", function(d, i) { 
  //  d3.select("#message").text(d); 
  //});

});

function zoomed() {
  svgMap.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  svgMap.attr("transform", d3.event.transform); // updated for d3 v4
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
