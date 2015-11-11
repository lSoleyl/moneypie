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
  /** A simple function to retrieve the precomputed colors by index
   */
  function getColor() {
    return colors[++ci % colors.length]
  }

  /** The event handler for clicking a section of a chart.
   *  All important references are kept inside the canvas object
   */
  function chartClick(event) {
    var canvas = this
    var segments = this.chart.getSegmentsAtEvent(event)
    if (segments.length != 0) { //clicked inside a segment
      var segment = segments[0]

      //Draw next line of diagrams
      async.nextTick(function() { drillInto(canvas.level + 1, canvas.grouped[segment.label], canvas.filters) }) 
    }
  }


  /** This function will add a new level of charts beginning at the given level
   *  it will erase all previous charts at higher levels (lower rows).
   *  It registers the event handler, which in turn calls drillInto() with level+1
   *
   * @param level current drill level 0 for initial drill
   * @param dataset subset of the portfolio to drill down on
   * @param filters the remaining filters which can be applied to the dataset 
   */
  function drillInto(level, dataset, filters) {
    var content = $("#overviewContentDiv")

    //Remove all lines below the drilled one
    var titlerows = content.children("div[content=title]").slice(level)
    var canvasrows = content.children("div[content=canvas]").slice(level)

    _.each(titlerows, function(element) { $(element).remove() })
    _.each(canvasrows, function(element) { $(element).remove() })

    //Nothing to drill down on
    if (filters.length == 0)
      return

    //Insert new rows
    var titleRow = $('<div class="row" content="title"></div>')
    var canvasRow = $('<div class="row" content="canvas"></div>')
    content.append(titleRow)
    content.append(canvasRow)

    _.each(filters, function(filter) {
      var title = $('<div class="col-md-4"><center>By ' + filter.name + '</center></div>')
      var canvas = $('<canvas></canvas>')

      title.appendTo(titleRow)
      canvas.appendTo('<div class="col-md-4">').appendTo(canvasRow)

      async.nextTick(function() { //Canvas is not immediately ready
        var canvasElement = canvas[0]
        var ctx = canvasElement.getContext("2d")
        var chart = new Chart(ctx).Pie()

        var accessor = filter.key
        if (typeof accessor == "string") {
          accesskey = accessor
          accessor = function(x) { return x[accesskey] }
        }

        ci = 0 //Reset color index for each diagram
        var grouped = _.groupBy(dataset, accessor)
        var segments = _.map(grouped, function(assets, type) {
          return _.assign({
            value: _.sum(assets, function(asset) { return asset.volume() }).toFixed(2),
            label: type
          }, getColor())
        })
        
        //Save chart refrence and data inside DOM for event handler
        canvasElement.chart = chart 
        canvasElement.grouped = grouped
        canvasElement.level = level
        canvas.click(chartClick)

        //Remove current filter from filterlist and replace with next sublevel if available
        canvasElement.filters = _.filter(filters, function(f) { return f.name != filter.name })

        if (filter.next)
          canvasElement.filters.push(filter.next)

        _.each(segments, function(segment) { chart.addData(segment) })
        chart.update()
      })
    })
  }



  view.onShow = function() {
    var content = $("#overviewContentDiv")
    content.empty() //Clear all charts if the page is redisplayed

    if (portfolio.assets.length == 0) {
      content.append($('<div class="alert alert-warning" role="alert">Portfolio is empty, add assets first</div>'))
      return
    }

    //Display initial drill (type,currency/continent)
    drillInto(0, portfolio.assets, filters)
  }

  return view
})