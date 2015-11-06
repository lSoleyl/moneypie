/** Logic module for addAsset view
 */
define(["model", "jquery", "lodash", "async", "assets", "portfolio"],
function(model,    $,         _,      async,   assets,   portfolio) {
  var view = {}

  var selectedType = undefined
  var selectedCountry = undefined

  var select = undefined
  var button = undefined
  var input = undefined

  /** This map defines which fields have to be visible for which asset type
   */
  var visibleFields = {
    "currency": ["Price", "Region"],
    "loan":     ["Price", "Region"],
    "stock":    ["Region", "Quantity", "Stock"],
    "property": ["Price", "Region"],
    "ressource":["Price", "Quantity"] //Region should be irrelevant for ressources
  }


  function showMessage(message, type, cb) {
    type = type || "info"
    var messageDiv = $('<div class="alert alert-' + type + '" role="alert">' + message + '</div>')
    messageDiv.hide() 

    $("div#addAssetMessages").append(messageDiv)
    messageDiv.slideDown(500, function() {
      setTimeout(function() {
        messageDiv.fadeOut(2000, function() {
          messageDiv.remove()
          if (cb)
            async.nextTick(cb)
        })
      }, 2000)
    })
  }

  function messageSucces(message) { showMessage(message, "success") }
  function messageInfo(message)   { showMessage(message, "info") }
  function messageError(message)  { 
    showMessage(message, "danger", function() {
      $("div#addAssetFieldWrapper div.has-error").removeClass("has-error") //Clear all form errors after message faded
    }) 
  }


  /** This function shows/hides input fields based on the currently selected
   *  asset type
   */
  function redisplayFields() {
    $("div#addAssetFieldWrapper > div.form-group").hide() //Hide all form input elements
    selectedType = select.type.val()
    _.each(visibleFields[selectedType], function(groupName) { //Show all needed fields
      var selector = "div#addAsset" + groupName + "Div"
      $(selector).show()
      updateCountries() //Other countries are displayed depending on the selected type
    })
  }


  /**The country map will map from a continent name to all known country objects
   * of that continent
   */
  var countryMap = {} 

  /** This function will called every time, the continent selection has changed.
   *  It will change the available options of the country selection accordingly
   */
  function updateCountries() {
    var selectedContinent = select.continent.val()
    
    var countries = countryMap[selectedContinent]
    if (selectedType == "stock") { //Only allow countries, we have stocks for
      countries = _.filter(countries, function(country) { return country.stocklist !== undefined })
    }

    var options = _.map(countries, function(country) {
      return $('<option value="' + country.id + '">' + country.name + '</option>')
    })

    select.country.empty() //clear current options
    select.country.append(options)
    countryChanged()
  }


  /** This function will change the selectable stocks depending on the selected country.
   *  It will also set the available currencies for other asset types
   */
  function countryChanged() {
    selectedCountry = select.country.val()

    //Only update stock list if we are actually adding stocks to our portfolio 
    if (selectedType == "stock") { 
      var availableStocks = _.sortBy(_.filter(model.stocks, function(stock) { return stock.country == selectedCountry }), 'name')
      var options = _.map(availableStocks, function(stock) {
        return $('<option value="' + stock.isin + '">' + stock.name + '</option>')
      })

      select.stock.empty()
      select.stock.append(options)
    }

    //Update available currencies
    var options = _.map(model.countries[selectedCountry].currencies, function(currencyId) {
      var currency = model.currencies[currencyId]
      return $('<option value="' + currency.id + '">' + currency.symbol + '   - ' + currency.name + '</option>')
    })

    select.currency.empty()
    select.currency.append(options)
  }


  function addAsset() {
    //Get Asset data
    if (selectedType == "stock") {
      var amount = parseInt(input.quantity.val())
      if (amount <= 0) {
        input.quantity.parent("div").addClass("has-error")
        messageError("Entered negative quantity of assets")
        return
      }

      var stockObj = model.stocks[select.stock.val()]
      portfolio.addAsset(assets.stock(stockObj, amount))

      messageSucces("Successfully added stocks to portfolio")
    } else {
      messageError("not yet supported!")
    }
  }

  /** This function will be called when the addAsset view is loaded the first time
   */
  view.onLoad = function() {
    model.ready(function() { //Wait for model to be fully loaded
      
      //Assign these selectors here to only define them once
      select = {
        continent: $("select#addAssetContinent"),
        country:   $("select#addAssetCountry"),
        currency:  $("select#addAssetCurrency"),
        stock:     $("select#addAssetStock"),
        type:      $("select#addAssetType")        
      }

      button = {
        reset:     $("button#addAssetReset"),
        submit:    $("button#addAssetSubmit")
      }

      input = {
        quantity:  $("input#addAssetQuantity"),
        value:     $("input#addAssetValue")
      }
      

      
      //Generate continent options
      var continentOptions = _.map(model.continents, function(data, continentName) {
        return $('<option value="' + continentName + '">' + continentName + '</option>')
      })

      select.continent.append(continentOptions)

      //Build countryMap
      _.each(model.continents, function(data, continentName) {
        countryMap[continentName] = _.sortBy(_.filter(model.countries, function(country) {
          return country.continent == continentName
        }),'name')
      })

      select.continent.change(updateCountries) //Register change callback
      updateCountries() //Update once

      select.country.change(countryChanged)
      countryChanged() //Update once

      select.type.change(redisplayFields) //Register change callback for type field
      redisplayFields() //Update once

      button.submit.click(addAsset)

      //TODO load currency information

      //TODO redisplay fields, when reset is clicked
    })
  }

  return view
})