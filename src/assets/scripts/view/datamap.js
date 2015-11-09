define(['topojson', 'd3', 'datamaps'], function(t,d, Datamap) {
  var view = {}

  view.onLoad = function() {
    this.worldMap = new Datamap({
      element: document.getElementById("worldmapDiv")
    })
  }

  return view
})