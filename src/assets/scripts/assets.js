/** This module defines the assets utility module 
 *  and the hidden Asset class.
 */
define(["model", "loader/currency"], function(model, currency) {
  var Asset = function(name, type, amount) {
    this.name = name
    this.type = type
    this.amount = amount || 1
    this.price = { currency:"EUR", value:0.0 }
  }

  /** This method returns the total assets value in euro
   */
  Asset.prototype.volume = function(currencies) {
    return currency.toEuro(this.price.currency, this.amount * this.price.value)
  }

  var assets = {}


  assets.currency = function(symbol, amount) {
    


    var asset = new Asset("currency", amount)



    return asset
  }

  assets.stock = function(stockObj, amount) {
    var asset = new Asset(stockObj.name, "stock", amount)
    asset.isin = stockObj.isin

    asset.price = {
      currency: model.countries[stockObj.country].currencies[0], //All countries with a stocklist have only one currency,
      value: stockObj.value //TODO get current stock price from stock price loader
    }

    return asset
  }

  /** This function will restore an object's prototype when it got loaded from
   *  local storage so that it's methods are available again.
   */
  assets.objToAsset = function(obj) {
    obj.__proto__ = Asset.prototype 
    return obj
  }

  //TODO utility functions to create assets



  return assets
})