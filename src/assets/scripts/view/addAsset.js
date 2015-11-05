/** Logic module for addAsset view
 */
define(["model", "jquery", "lodash", "async", "assets", "portfolio"],
function(model,    $,         _,      async,   assets,   portfolio) {
  var view = {}

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
    
    var options = _.map(countryMap[selectedContinent], function(country) {
      return $('<option value="' + country.id + '">' + country.name + '</option>')
    })

    countrySelection.empty() //clear current options
    countrySelection.append(options)
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


      //TODO load currency information and stock information.

      //TODO asset creation and additon to portfolio if "add asset" is clicked
    })
  }

  return view
})