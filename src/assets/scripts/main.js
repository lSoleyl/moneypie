/**
 * MoneyPi EntryPoint
 */
$(function(){
  console.log('Hi, from MoneyPie');

  // Initialize Routing for Single Plage Application
  initRouting();

  // Load Data
  loadData();

});

var continents;
var countries;
var currencies;

function loadData(){
  console.log('Loading data');

  $.getJSON("./assets/data/continents.json", function(data){
    continents = data;
  });

  $.getJSON("./assets/data/countries.json", function(data){
    countries = data;
  });

  $.getJSON("./assets/data/currencies.json", function(data){
    currencies = data;
  });
}
