define(['jquery', 'async', 'utils/yql', 'storage', 'utils/message'], function($, async, yql, storage) {
  var message = require('utils/message')('#statusDiv')

  var module = {}

  module.resources = {} //A name -> price map for resources
  module.lastUpdate = undefined

  function today() { return (new Date()).toDateString() }

  function updateResources() {
    yql("http://www.boerse.de/rohstoffpreise", function(err,res) {
      if (err) {
        message.error("Failed to update resource prices")
        console.error(err)
        return
      }

      //TODO select correct elements
      var rows = $(res).find("table#pushList > tbody > tr")
      
      var tempResources = {}
      _.each(rows, function(row) {
        var name = $(row).find("td:nth-child(2) > div").attr("title")
        var valuestr = $(row).find("td:nth-child(3) > div").text()

        var value = parseFloat(valuestr.replace('.', '').replace(',', '.'))

        tempResources[name] = value
      })

      module.resources = tempResources
      module.lastUpdate = today()
      module.save() //Save updated values
      message.info("Updated resource prices")
    })
  }

  module.save = function() {
    storage.save("resourceData", module.resources)
    storage.save("resourceDate", module.lastUpdate)
  }

  module.load = function() {
    module.resources = storage.load("resourceData") || {}
    module.lastUpdate = storage.load("resourceDate")
  }

  module.init = function() {
    module.load() //Load known data from local storage

    if (module.lastUpdate != today())
      updateResources()
  }

  return module
})