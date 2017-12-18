var chart;
// Initializing color variables for dendrogram, chart, heatmap;
var color = d3.scale.category20b();
var colors = ["#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8"]
//["#EFD5D9","#EFD5D9","#EABEC6","#EAACB6","#E593A1","#E27487","#E25668","#DD4A63"]

var baseColor = d3.scale.ordinal()
  .domain(["A", "T", "G", "C"])
  .range(["#E27487", "#1d91c0", "#7fcdbb", "#edf8b1"]);

var colorScale = d3.scale.quantile()
  .range(colors);


var buckets = colors.length;

chart = d3.select("#imagetree").append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 800 700")
  .attr("preserveAspectRation", "xMinYMid")
  .append("g")
  .attr("transform", function (d) {
    return "translate(40,40)";
  });

d3.tsv("./../data/checklist.tsv", function (error, data) {

  var gridWidth = 40,
    gridHeight = 13.5;

  console.log(data)
  colorScale.domain([0, buckets - 1, d3.max(data, function (d) {
    return d.value;
  })])

  var speciesName = [],
    sampleName = [];

  data.forEach(function (d) {
    console.log(d)
    if (sampleName.indexOf(d.sample) == -1)
      sampleName.push(d.sample);

    if (speciesName.indexOf(d.name) == -1)
      speciesName.push(d.name)
  });
  var heatmap = chart.selectAll(".cellg")
    .data(data)
    .enter().append("circle")
    .attr("cx", function (d) {
      return 260 + sampleName.indexOf(d.sample) * (gridWidth)
    })
    .attr("cy", function (d, i) {
      return speciesName.indexOf(d.name) * (gridHeight + 7)
    })
    .attr("class", function (d) {
      if (d.specificity == 0) {
        return "cell cell-border cr" + (d.name - 1) + " cc" + (d.sample - 1);
      } else {
        return "cell-specific cell cell-border cr" + (d.name - 1) + " cc" + (d.sample - 1);
      }
    })
    .attr("transform", function (d, i) {
      return "translate(" + ((gridWidth - 25) + ',' + (gridHeight) + ")");
    })
    .attr("r", function (d) {

      // return Math.log2(d.value) + "px";
      return "7px";
    });


  heatmap.transition().duration(500)
    .style("fill", function (d) {

      if (d.value == '-' || d.value == "?")
        return "url(#nullPattern)";

      if (d.value >= 0)
        return colorScale((d.value));

    });

})
