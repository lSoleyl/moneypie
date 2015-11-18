define(['topojson', 'd3', 'lodash', 'datamaps', 'model', 'portfolio'], function(t,d, _, Datamap, model, portfolio) {
  var view = {}

  view.onShow = function() {

    // Thresholds for Coloring
    var lightThreshold = 0;
    var mediumThreshold = 0.05;
    var heavyThreshold = 0.1;

    // Amount of Assets in Portfolio
    var totalAssets = portfolio.assets.length

    // Prepare Country Data for Visualization
    var data = {}
    _.each(model.countries, function(country){

      // Fetch Assets for given Country from Portfolio
      var assets = portfolio.assetsByCountry(country.id)
      var fillKey = "defaultFill";

      // Determine FillKey by CountryAssets/TotalAssets Ratio
      var assetRatio = assets? assets.length/totalAssets : 0
      if (assetRatio > heavyThreshold){
        fillKey = "heavy"
      } else if (assetRatio > mediumThreshold){
        fillKey = "medium"
      } else if (assetRatio > lightThreshold){
        fillKey = "light"
      }

      data[country.id] = { fillKey: fillKey, assets: assets.length }
    })
    if(this.worldMap == undefined) {
      this.worldMap = new Datamap({
        element: document.getElementById("worldmapDiv"),
        projection: 'mercator',
        geographyConfig: {
          popupTemplate: function(geography, data) {
            return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong><br>Assets: ' +  data.assets + ' '
          }
        },
        fills: {
          defaultFill: "lightgrey",
          light: "#65ae75",
          medium: "#388e3c",
          heavy: "#286118"
        },
        data: data
      })
    } else {
      for (var key in data) {
        var newData = {};
        if (key != -99) {
          newData[key] = {
            fillKey: data[key].fillKey
          };
          this.worldMap.updateChoropleth(newData);
        }
      }
    }
  }

  return view
})
