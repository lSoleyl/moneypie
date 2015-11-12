/** This module defines the assets utility module 
 *  and the hidden Asset class.
 */
define(["model", "loader/currency", "loader/resource"], function(model, currency, resource) {
  var Asset = function(name, type, amount) {
    this.name = name
    this.type = type
    this.amount = amount || 1
    this.price = { currency:"EUR", value:0.0 }
    this.region = { continent:undefined, country:undefined }
  }


  /** This function converts a countryID into a region = { continent, country }
   * 
   * @param countryId the country to look the continent up for
   */
  function getRegion(countryId) {
    var country =  model.countries[countryId]
    if (!country)
      throw "Invalid countryId passed!"

    return {
      continent: country.continent,
      country: country.id
    }
  }

  /** This method returns the total assets value in euro
   */
  Asset.prototype.volume = function(currencies) {
    return currency.toEuro(this.price.currency, this.amount * this.price.value)
  }

  var assets = {}

  /** Returns a new liquidity asset.
   * 
   * @param symbol the three letter string symbol for the currency (see model.currencies)
   * @param countrySymbol the three letter string symbol of the currency's country
   * @param amount how much of that currency makes up the created asset
   */
  assets.liquidity = function(symbol, countrySymbol, amount) {
    var asset = new Asset(model.currencies[symbol].name, "liquidity", amount)
    asset.price = {
      currency: symbol,
      value: 1
    }

    asset.region = getRegion(countrySymbol)
    return asset
  }

  /** Returns a new stock asset
   *
   * @param stockObj the stock to create an asset for (from model.stocks)
   * @param amount how many stocks make up the asset
   */
  assets.stock = function(stockObj, amount) {
    var asset = new Asset(stockObj.name, "stock", amount)
    asset.isin = stockObj.isin

    asset.price = {
      currency: model.countries[stockObj.country].currencies[0], //All countries with a stocklist have only one currency,
      value: stockObj.value //TODO get current stock price from stock price loader
    }

    asset.region = getRegion(stockObj.country)
    return asset
  }


  /** Returns a new loan asset
   *
   * @param description a short description of the loan to show in diagrams and lists and identify the asset
   * @param countrySymbol the three letter symbol of the country in which the loan is located
   * @param value the price the loan was bought for
   * @param currencySymbol the three letter symbol of the currency of the loan
   */
  assets.loan = function(description, countrySymbol, value, currencySymbol) {
    var asset = new Asset(description, "loan")

    asset.price = {
      currency: currencySymbol,
      value: value
    }

    asset.region = getRegion(countrySymbol)
    return asset
  }

  /** Returns a new property asset
   *
   * @param description a short description of the property to show in diagrams and lists and identify the asset
   * @param countrySymbol the three letter symbol of the country in which the property is located
   * @param value the price the property was bought for
   * @param currencySymbol the three letter symbol of the currency of the property
   */
  assets.property = function(description, countrySymbol, value, currencySymbol) {
    var asset = new Asset(description, "property")

    asset.price = {
      currency: currencySymbol,
      value: value
    }

    asset.region = getRegion(countrySymbol)
    return asset
  }

  /** This function creates a new resource asset
   */
  assets.resource = function(name, amount) {
    var asset = new Asset(name, "resource", amount)

    asset.price = {
      currency: "EUR", //all resources' prices are in €
      value: resource.resources[name]
    }
    //resources are region independant

    return asset
  }

  /** This function will restore an object's prototype when it got loaded from
   *  local storage so that it's methods are available again.
   */
  assets.objToAsset = function(obj) {
    obj.__proto__ = Asset.prototype 
    return obj
  }


  return assets
})