/** This module defines the portfolio object
 */
define(["storage", "assets", "lodash"], function(storage, assets, _) {
  var portfolio = { assets:[] }
  var key = "portfolio"

  portfolio.load = function(assetArray) {
    var assetList = assetArray || storage.load(key) || []
    this.assets = _.map(assetList, assets.objToAsset) //Convert plain objects into assets
  }

  portfolio.save = function() {
    storage.save(key, this.assets)
  }

  portfolio.addAsset = function(asset) {
    this.assets.push(asset)
    //TODO check whether we already have assets of same id and just add amount
    this.save()
  }

  /** This function returns the portfolio's total worth in euro by
   *  accumulating the volumes of the portfolio's assets.
   */
  portfolio.volume = function() {
    return _.sum(this.assets, function(asset) { return asset.volume() })
  }

  return portfolio
})