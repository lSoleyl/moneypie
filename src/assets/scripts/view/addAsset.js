/** Logic module for addAsset view
 */
define(["model", "jquery", "lodash", "async", "assets", "portfolio"],
function(model,    $,         _,      async,   assets,   portfolio) {
  var view = {}

  var selectedType = undefined

  /** This map defines which fields have to be visible for which asset type
   */
  var visibleFields = {
    "currency": ["Price", "Region"],
    "loan":     ["Price", "Quantity", "Region"],
    "stock":    ["Region", "Quantity", "Stock"],
    "property": ["Price", "Region"],
    "ressource":["Price", "Quantity"] //Region should be irrelevant for ressources
  }


  /** This function shows/hides input fields based on the currently selected
   *  asset type
   */
  function redisplayFields() {
    $("div#addAssetFieldWrapper > div.form-group").hide()
    selectedType = $("select#assetType").val()
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
    var selectedContinent = $("select#assetContinent").val()
    var countrySelection = $("select#assetCountry")
    
    var countries = countryMap[selectedContinent]
    if (selectedType == "stock") { //Only allow countries, we have stocks for
      countries = _.filter(countries, function(country) { return country.stocklist !== undefined })
    }

    var options = _.map(countries, function(country) {
      return $('<option value="' + country.id + '">' + country.name + '</option>')
    })

    countrySelection.empty() //clear current options
    countrySelection.append(options)
  }


  /** This function will change the selectable stocks depending on the selected country
   */
  function countryChanged() {
    //TODO update stock selection
  }


  /** This function will be called when the addAsset view is loaded the first time
   */
  view.onLoad = function() {
    model.ready(function() { //Wait for model to be fully loaded
      var continentSelection = $("select#assetContinent")

      //Generate continent options
      var continentOptions = _.map(model.continents, function(data, continentName) {
        return $('<option value="' + continentName + '">' + continentName + '</option>')
      })

      continentSelection.append(continentOptions)

      //Build countryMap
      _.each(model.continents, function(data, continentName) {
        countryMap[continentName] = _.sortBy(_.filter(model.countries, function(country) {
          return country.continent == continentName
        }),'name')
      })

      continentSelection.change(updateCountries) //Register change callback
      updateCountries() //Update once

      $("select#assetCountry").change(countryChanged)
      countryChanged() //Update once

      $("select#assetType").change(redisplayFields) //Register change callback for type field
      redisplayFields() //Update once


      //TODO load currency information and stock information.

      //TODO asset creation and additon to portfolio if "add asset" is clicked
    })
  }

  return view
})