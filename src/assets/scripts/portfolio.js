/** This module defines the portfolio object
 */
define(["storage", "lodash"], function(storage, _) {
  var portfolio = { assets:[] }
  var key = "portfolio"

  portfolio.load = function() {
    var assets = storage.load(key) || []
    this.assets = assets
  }

  portfolio.save = function() {
    storage.save(key, this.assets)
  }

  portfolio.addAsset = function(asset) {
    this.assets.push(asset)
    //TODO check whether we already have assets of same id and just add amount
    this.save()
  }

  

  return portfolio
})