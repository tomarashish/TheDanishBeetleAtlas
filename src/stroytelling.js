//story telling
// first page with family occurance https: //bl.ocks.org/curran/649fe7203bf995a23478986f623b9673
// first page with species occurance https: //bl.ocks.org/curran/649fe7203bf995a23478986f623b9673

// with serach option https: //www.visualcinnamon.com/babynamesus
function groupAsTree(data) {

  var treeData = {
    "key": "Root",
    "values": d3.nest()
      /*.key(function (d) {
        return d.kingdom;
      })
      .key(function (d) {
        return d.phylum;
      })
      .key(function (d) {
        return d.class;
      })*/
      .key(function (d) {
        return d.order;
      })
      .key(function (d) {
        return d.family;
      })
      .key(function (d) {
        return d.genus;
      })
      .key(function (d) {
        return d.species;
      })
      .entries(data)
  };
  return treeData;
}

//d3.json("data/taxonomy_tree.json", function (error, taxoData) {
d3.csv("./../data/coleoptera_taxonomy.csv", function (error, taxoData) {
  //console.log(JSON.stringify(groupAsTree(taxoData)));
  console.log(groupAsTree(taxoData));

  //var treeview = circlePack();
  var treeview = hierarchyViewer();

  var chartContainer = d3.select("#reftree")
    .datum(groupAsTree(taxoData))
    //.datum(taxoData)
    .call(treeview);

});
