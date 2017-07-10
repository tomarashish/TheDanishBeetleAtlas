 //https://blog.madewithenvy.com/local-maps-with-canvas-d3-38ea389fca30
//http://download.geonames.org/export/dump/

 queue()
    .defer(d3.csv, './../data/merge_data.csv')
	.await(createBarData);

function createBarData(error, atlasData){
  
  var familyCount1 = 0 ;
  var familyCount2 = 0;
  var familyCount3 = 0;
  
  var speciesCount1 = 0 ;
  var speciesCount2 = 0;
  var speciesCount3 = 0;
  
  var familyName1 = [];
  var familyName2 = [];
  var familyName3 = [];
  var speciesName1 = [];
  var speciesName2 = [];
  var speciesName3 = [];
  
    console.log(atlasData)
  
  atlasData.forEach(function(objData){
    if(objData.DateYear < 1900){
      if (familyName1.indexOf(objData.Family) == -1){
          familyName1.push(objData.Family);
          familyCount1 += 1;  
      }
      
      if (speciesName1.indexOf(objData.Taxon) == -1) {
            speciesName1.push(objData.Taxon);
            speciesCount1 += 1; 
      }
    }
    
    if(objData.DateYear > 1900 && objData.DateYear < 1960){
      if (familyName2.indexOf(objData.Family) == -1) {
          familyName2.push(objData.Family);
          familyCount2 += 1;  
      }
      if (speciesName2.indexOf(objData.Taxon) == -1) {
            speciesName2.push(objData.Taxon);
            speciesCount2 +=1  
      }
    }
    
    if(objData.DateYear > 1961 && objData.DateYear < 2016){
      if (familyName3.indexOf(objData.Family) == -1){ 
          familyName3.push(objData.Family);
          familyCount3 += 1;  
      }
      if (speciesName3.indexOf(objData.Taxon) == -1) 
            speciesName3.push(objData.Taxon);
            speciesCount3 +=1  
    }
    
  });
  console.log(speciesCount1 +' '+ speciesCount2 +' '+ speciesCount3)
  console.log(familyCount1 +' '+ familyCount2 +' '+ familyCount3)
}