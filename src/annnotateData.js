//Add geoCoordinates for missing data and change
// Change UTM cordinates to Lat Long format
//


queue()
  .defer(d3.csv, './../data/merge_data.csv')
  .await(getCoordinates);

function getCoordinates(error, atlasData) {

  //https://github.com/proj4js/proj4js
  var utm = "+proj=utm +zone=32";
  var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

  //change UTm to latlang
  for (var i = 0; i < atlasData.length; i++) {

    if (atlasData[i].XKoord != "NA" || atlasData[i].YKoord != "NA") {
      var LatLang = [];
      atlasData[i].LatLang = proj4(utm, wgs84, [atlasData[i].XKoord, atlasData[i].YKoord]);
    }
    //end of for loop
    else {

      var address = atlasData[i].Lokalitet

      // Initialize the Geocoder
      geocoder = new google.maps.Geocoder();
      if (geocoder) {
        geocoder.geocode({
          'address': address
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            // console.log(results[0]);
          }
        });
      }
    }
  }

}

function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

function downloadCSV(args) {
  var data, filename, link;

  var csv = convertArrayOfObjectsToCSV({
    data: stockData
  });
  if (csv == null) return;

  filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}


var chartObj = [];


function groupAsTree(data) {

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

//d3.json("data/taxonomy_tree.json", function (error, taxoData) {
d3.csv("./../data/BilleDatabase.csv", function (error, taxoData) {
  //console.log(JSON.stringify(groupAsTree(taxoData)));
  console.log(groupAsTree(taxoData));

  var sunview = sunburstD3();
  //var sunview = circlePack();

  var chartContainer = d3.select("#sunChart")
    .datum(groupAsTree(taxoData))
    .call(sunview);

});
