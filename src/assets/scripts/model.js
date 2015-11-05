define(['jquery', 'lodash', 'async'], function($, _, async) {
  //console.log('Loading data');

  var model = {};

  var ready = false
  var requestQueue = []

  /** Function used, to load a certain static json asset
   */
  function loadData(name, callback) {
    $.getJSON("./assets/data/" + name + ".json", function(data) {
      model[name] = data
      async.nextTick(function() { callback(null) })
    })
  }

  /** This function can be called to wait until direct 
   *  model access is safe, because loading is done.
   *
   * @param cb a function which should be called if the model is loaded
   */
  model.ready = function(cb) {
    if (!ready)
      return requestQueue.push(function() { cb(null) })

    async.nextTick(function() { cb(null) })
  }

  //Static data to load
  var loadList = ["continents", "countries", "currencies"]
  async.map(loadList, loadData, function(err, res) {
    console.log("model loaded.")
    ready = true;
    if (requestQueue.length > 0) //Schedule all pending requests for execution
      _.each(requestQueue, function(request) { async.nextTick(request) })
  })
  
  return model;
});
