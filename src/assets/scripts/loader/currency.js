/** Currency data loading module
 */
define(["storage", "jquery"], function(storage, $) {
  var currency = {}
  var currencyData = null

  function today() { return (new Date()).toDateString() }

  function update() {
    $.ajax("http://api.fixer.io/latest", {success:function(result) {
      currencyData = result
      currencyData.lastUpdate = today() //Update currencies at most daily
      storage.save("currency", currencyData)
    }})
  }

  /** Call this function to load the latest saved currency data from
   *  localstorage and update if necessary
   */
  currency.load = function() {
    currencyData = storage.load("currency")
    if (!currencyData || currencyData.lastUpdate != today())
      update()
  }

  /** Returns true if an exchange rate is known for the given currency
   *
   * @param symbol the 3 letter string id from currencies.json
   *
   * @return true if the currency symbol is known otherwise false
   */
  currency.isKnown = function(symbol) {
    if (!currencyData)
      throw "No curreny data laoded yet!"

    //Must be either the base currency or a currency, we know the conversion for
    if (currencyData.base == symbol || currencyData.rates[symbol] !== undefined)
      return true

    return false
  }


  /** This function can be called to convert a foreign currency into
   *  euro
   *
   * @param currencySymbol the 3 letter string id from currencies.json
   */
  currency.toEuro = function(currencySymbol, value) {
    if (!currencyData)
      throw "currency module isn't ready yet" //Shouldn't happen

    if (currencySymbol == currencyData.base) //No conversion needed
      return value

    var rate = currencyData.rates[currencySymbol]
    if (rate === undefined)
      throw "unknown currency: '" + currencySymbol + "'"

    return value / rate
  }


  return currency
})
