var margin = {right: 50, left: 50, top:20, bottom:50},
  width = 700,
    height= 50,
    sliderWidth = 600;

var svg = d3.select("#slider").append("svg")
      .attr("width", width)
      .attr("height", height);

var xFirst = d3.scaleLinear()
    .domain([1900, 2017])
    .range([0, sliderWidth])
    .nice();

var xLast = d3.scaleLinear()
    .domain([1900, 2017])
    .range([0, sliderWidth])
    .clamp(true);

var sliderFirst = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," +height/2 + ")");

var sliderLast = svg.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(" + margin.left + "," +height/2 + ")");

sliderFirst.append("line")
    .attr("class", "track")
    .attr("id", "track1")
    .attr("x1", xFirst.range()[0])
    .attr("x2", xFirst.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
          .on("start.interrupt", function() {  sliderLast.interrupt(); })
          .on("start drag", function() {moveSlideFirst(xFirst.invert(d3.event.x)); })
         );

sliderLast.append("line")
  .attr("class", "track")
  .attr("id", "track1")
  .attr("x1", xLast.range()[0])
      .attr("x2", xLast.range()[1])
.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
         .on("start.interrupt", function() { sliderFirst.interrupt(); })
        .on("start drag", function() { moveSlideLast(xLast.invert(d3.event.x)); })
       );


sliderFirst.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(xFirst.ticks(10))
  .enter().append("text")
    .attr("x", xFirst)
    .attr("text-anchor", "middle")
    .style("fill", "#000")
    .text(function(d) { return d ; }); 

sliderLast//.insert("g", ".track-overlay")
    .attr("transform", "translate(50," + 18 + ")")
    .data(xLast.ticks(10));

var handle1 = sliderFirst.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("cx",xFirst.range()[0])
    .attr("r", 9);

var handle2 = sliderLast.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("cx",xLast.range()[1])
      .attr("r", 9);

function moveSlideFirst(d) {
    if (handle2.attr("cx") < (xFirst(d))) {
      console.log("inloop")
      handle1.attr("cx", handle2.attr("cx"));
    } else {
      handle1.attr("cx", xFirst(d));
    }  
  
    //console.log("hue", " cx: ",xYearFirst(h),", year:",h);
  }

function moveSlideLast(d){
  
  if (handle1.attr("cx") > xFirst(d)) {
      handle2.attr("cx", handle1.attr("cx"));
    } else {
      handle2.attr("cx", xFirst(d));
    } 
}