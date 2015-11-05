/** This module defines the assets utility module 
 *  and the hidden Asset class.
 */
define(["model"], function(model) {
  var Asset = function(name, type, amount) {
    this.name = name
    this.type = type
    this.amount = amount || 1
    this.price = {}
  }

  Asset.prototype.volume = function(currencies) {
    //TODO currencyfactor*amount*price
  }



  var assets = {}


  assets.currency = function(symbol, amount) {
    


    var asset = new Asset("currency", amount)



    return asset
  }

  assets.stock = function(isin, amount) {
    var asset = new Asset("stock", amount)
    asset.isin = isin

    //TODO get current stock price from model/storage loader

    return asset
  }
  //TODO utility functions to create assets



  return assets
})