define(['jquery', 'chart', 'd3', 'async', 'portfolio'], function($, Chart, d3, async, portfolio) {
  var view = {}


  var filters = [
    {
      key:'type',
      name:'Type'
    },
    {
      key: function(x) { return x.price.currency },
      name: 'Currency'
    },
    {
      key: function(x) { return x.region.continent },
      name: 'Continent',
      next: {
        key: function(x) { return x.region.country },
        name: 'Country'
      }
    }
  ]


  var colors = _.map(d3.scale.category20().range(), function(color) { 
    return {
      color:color,
      highlight:color //TODO calculate highlighted color
    }
  })

  var ci = 0
  function getColor() {
    return colors[++ci % colors.length]
  }

  view.onShow = function() {

    var content = $("#overviewContentDiv")
    content.empty()
    
    


    if (portfolio.assets.length == 0) {
      content.append($('<div class="alert alert-warning" role="alert">Portfolio is empty, add assets first</div>'))
      return
    }


    var titleRow = $('<div class="row"></div>')
    var canvasRow = $('<div class="row"></div>')
    content.append(titleRow)
    content.append(canvasRow)

    _.each(filters, function(filter) {
      var title = $('<div class="col-md-4"><center>By ' + filter.name + '</center></div>')
      var canvas = $('<canvas></canvas>')

      title.appendTo(titleRow)
      canvas.appendTo('<div class="col-md-4">').appendTo(canvasRow)

      async.nextTick(function() { //Canvas is not immediately ready

        var ctx = canvas[0].getContext("2d")
        var chart = new Chart(ctx).Pie()
        var accessor = filter.key
        if (typeof accessor == "string") {
          accesskey = accessor
          accessor = function(x) { return x[accesskey] }
        }

        ci = 0 //Reset color index for each diagram
        var grouped = _.groupBy(portfolio.assets, accessor)
        var segments = _.map(grouped, function(assets, type) {
          return _.assign({
            value: _.sum(assets, function(asset) { return asset.volume() }).toFixed(2),
            label: type
          }, getColor())
        })

        _.each(segments, function(segment) { chart.addData(segment) })
        chart.update()
      })
    })
   
   
    
    //TODO add click listener

  }

  return view
})