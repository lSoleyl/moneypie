/** Logic module for addAsset view
 */
define(["model", "jquery", "lodash", "async", "assets", "portfolio", "utils/message"],
function(model,    $,         _,      async,   assets,   portfolio) {
  var view = {}

  var selectedType = undefined
  var selectedCountry = undefined

  var select = undefined
  var button = undefined
  var input = undefined

  var fields = undefined

  /** This map defines which fields have to be visible for which asset type
   */
  var visibleFields = {
    "currency": ["Price", "Region"],
    "loan":     ["Name", "Price", "Region"],
    "stock":    ["Region", "Quantity", "Stock"],
    "property": ["Name", "Price", "Region"],
    "ressource":["Price", "Quantity"] //Region should be irrelevant for ressources
  }

  //Initialize message module
  var message = require("utils/message")("div#addAssetMessages")
  message.error_clear = function(text) {
    message.error(text, function() {
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

  /** Function map with functions to instantiate the asset types
   */
  var assetLoader = {
    stock: function() { 
      return assets.stock(model.stocks[select.stock.val()], parseInt(input.quantity.val())) 
    },
    loan: function() { 
      return assets.loan(input.name.val(), selectedCountry, parseFloat(input.value.val()), select.currency.val())
    },
    currency: function() {
      return assets.currency(select.currency.val(), selectedCountry, parseFloat(input.value.val()))
    },
    property: function() {
      return assets.property(input.name.val(), selectedCountry, parseFloat(input.value.val()), select.currency.val())
    }
  }

  /** Input validation function
   */
  function validInput() {
    var valid = true
    _.each(fields, function($field) {
      var field = $field[0]
      if (field.validate && $field.is(":visible")) {
        try {
          field.validate($field.val())
        } catch (e) {
          $field.parent("div").addClass("has-error")
          message.error_clear(e)
          valid = false
        }
      }
    })
    return valid
  }


  /** Actually adds the asset to the portfolio
   */
  function addAsset() {
    //Validate input fields
    if (!validInput())
      return

    var newAsset = assetLoader[selectedType]

    if (newAsset) {
      portfolio.addAsset(newAsset())
      message.success("Successfully added new asset to portfolio")
    } else {
      message.error("Asset type not supported!")
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
        reset:     $("#addAssetReset"),
        submit:    $("#addAssetSubmit")
      }

      input = {
        name:      $("input#addAssetName"),
        quantity:  $("input#addAssetQuantity"),
        value:     $("input#addAssetValue")
      }
      
      fields = _.flatten([_.values(select), _.values(input)])

      
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

      //Input validation functions
      select.currency[0].validate = function(value) { if (!value) throw "No currency selected!" }
      input.name[0].validate = function(value)      { if (!value) throw "Missing asset name" }
      input.value[0].validate = function(value) { 
        $(this).val(value.replace(",","."))
        var val = parseFloat($(this).val())
        if (val <= 0 || val != val) //Second condition (=NaN)
          throw "Asset value must be a positive number!"        
      }
      input.quantity[0].validate = function(value) { 
        var val = parseInt(value)
        if (val <= 0 || val != val)
          throw "Asset quantity must be a positive number!"
      }


      //TODO load currency information
      //TODO redisplay fields, when reset is clicked
    })
  }

  return view
})