define(['topojson', 'd3', 'lodash', 'datamaps', 'model', 'portfolio'], function(t,d, _, Datamap, model, portfolio) {
  var view = {}

  // Color Range
  var minColor = "#F5F5F5"
  var maxColor = "#208208"
  var map = undefined;

  view.onShow = function() {

    // Generate WorldMap Data
    var data = generateMapData()

    if(map == undefined){

      map = new Datamap({
        element: document.getElementById("worldmapDiv"),
        projection: 'mercator',
        geographyConfig: {
            borderColor: '#DEDEDE',
            // show desired information in tooltip
            popupTemplate: function(geography, data) {
              return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong><br>Assets: ' +  data.assets + ' <br>Volume: ' + data.volume + ' €'
            }
        },
        fills: { defaultFill: '#F5F5F5' },
        data: data
      })

    } else {
      // Update Infos on Map
      map.updateChoropleth(data);
    }
  }

  /**
   * Generate Data for Countries to be displayed on WorldMap
   */
  function generateMapData(){
    // Amount of Assets in Portfolio
    var totalAssets = portfolio.assets.length

    // Prepare Country Data for Visualization
    var data = {}
    _.each(model.countries, function(country){

      if(country.id != -99){
        // Fetch Assets for given Country from Portfolio
        var assets = portfolio.assetsByCountry(country.id)
        var fillKey = "defaultFill"
        var volume = _.sum(assets, function(x) { return x.volume() })

        data[country.id] = { assets: assets.length, volume:volume.toFixed(2) }
      }
    })

    // We need to colorize every country based on number of Assets
    // colors should be unique for every value.
    // For this purpose we create palette(using min/max series-value)
    var assetValues = _.map(data, function(item){ return item.assets; })
    var minValue = Math.min.apply(null, assetValues),
        maxValue = Math.max.apply(null, assetValues)

    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3.scale.linear()
            .domain([minValue, maxValue])
            .range([minColor, maxColor])

    // fill dataset in appropriate format
    _.each(model.countries, function(country){
      if(country.id != -99)
        data[country.id].fillColor = paletteScale(data[country.id].assets)
    })

    return data
  }

  return view
})
