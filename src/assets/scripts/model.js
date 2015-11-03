define(['jquery', 'lodash'], function($, _) {
  //console.log('Loading data');

  var model = {};

  $.getJSON("./assets/data/continents.json", function(data){
    //console.log('Loading continents');

    model.continents = data;
  });

  $.getJSON("./assets/data/countries.json", function(data){
    //console.log('Loading countires');

    model.countries = data;
  });

  $.getJSON("./assets/data/currencies.json", function(data){
    //console.log('Loading currencies');

    model.currencies = data;
  });

  return model;
});
