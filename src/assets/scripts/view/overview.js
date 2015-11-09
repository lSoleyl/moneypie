define(['jquery', 'chart', 'd3', 'portfolio'], function($, Chart, d3, portfolio) {
  var view = {}



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



  var charts = []

  view.onShow = function() {
    var content = $("#overviewContentDiv")
    content.empty() //Remove all old data
    _.each(charts, function(chart) { chart.destroy() }) //Clear out old charts
    charts = []

    if (portfolio.assets.length == 0) {
      content.append('<div class="alert alert-warning" role="alert">Portfolio is empty, add assets first</div>')
      return
    }

    var row = $('<div class="row"></div>')

    //Add canvas, which groups portfolio by type
    var column = $('<div class="col-md-4"></div>')
    var canvas = $('<canvas></canvas>')
    column.append(canvas)
    row.append(column)
    content.append(row)

    var ctx = canvas[0].getContext("2d")
    var chart = new Chart(ctx).Pie()
    charts.push(chart)


    var grouped = _.groupBy(portfolio.assets, 'type')
    var segments = _.map(grouped, function(assets, type) {
      return _.assign({
        value: _.sum(assets, function(asset) { return asset.volume() }).toFixed(2),
        label: type
      }, getColor())
    })

    _.each(segments, function(segment) { chart.addData(segment) })
    chart.update()

    //TODO add other chart types
    //TODO redraw correctly after switching page
    //TODO change labels
    //TODO add click listener

  }

  return view
})