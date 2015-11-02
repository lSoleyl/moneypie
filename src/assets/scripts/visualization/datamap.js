/* Custom DataMap Visualization Script Resource */
define(['topojson', 'd3', 'datamaps'], function(t,d, Datamap) {
  var datamap = {}

  datamap.init = function(elementID) {
    this.worldMap = new Datamap({
      element: document.getElementById(elementID)
    })
  }

  return datamap
})