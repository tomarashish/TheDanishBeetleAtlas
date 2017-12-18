//story telling
// first page with family occurance https: //bl.ocks.org/curran/649fe7203bf995a23478986f623b9673
// first page with species occurance https: //bl.ocks.org/curran/649fe7203bf995a23478986f623b9673
var chartObj = [];
// with serach option https: //www.visualcinnamon.com/babynamesus
function groupAsTree(data) {

  //
  var treeData = {
    "key": "Root",
    "values": d3.nest()
      .key(function (d) {
        return d.Orden;
      })
      .key(function (d) {
        return d.Overfamilie;
      })
      .key(function (d) {
        return d.Familie;
      })
      .key(function (d) {
        return d.Underfamilie;
      })
      .key(function (d) {
        return d.Tribus;
      })
      .key(function (d) {
        return d.Slægt;
      })
      .key(function (d) {
        return d.Art;
      })
      .entries(data)
  };
  return treeData;
}

d3.csv("./../data/BilleDatabase.csv", function (error, taxoData) {
  //console.log(JSON.stringify(groupAsTree(taxoData)));
  console.log(groupAsTree(taxoData));

  //var circleview = circlePack();
  var treeview = hierarchyViewer();

  var chartContainer = d3.select("#reftree")
    .datum(groupAsTree(taxoData))
    .call(treeview);

  var chartContainer = d3.select("#imagetree")
    .datum(groupAsTree(taxoData))
  // .call(circleview);

});
