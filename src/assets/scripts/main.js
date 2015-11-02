requirejs.config({
  shim: {
    //These modules need manual dependency specification
    'bootstrap': {'deps': [ 'jquery' ] },
    'datamaps': {'deps': ['d3', 'topojson']}
  },

  paths: {
    'jquery':'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min',
    'bootstrap':'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min',
    'lodash':'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min',
    'async':'https://cdnjs.cloudflare.com/ajax/libs/async/1.5.0/async.min',
    'd3':'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min',
    'topojson':'https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min',
    'datamaps':'https://cdn.rawgit.com/markmarkoh/datamaps/master/dist/datamaps.world.min'
  }
})

requirejs(['routing', 'jquery', 'bootstrap'], function(routing, $) {
  $(function(){
    console.log('Hi, from MoneyPie');

    // Initialize Routing for Single Plage Application
    routing.init();

    //Force first routing because we don't have to start browsing this page form the landing page
    routing.route(); 

    // Load Data
    loadData($); //TODO refactor into own module?

  })

  /**
   * MoneyPi EntryPoint
   */

  var continents; //TODO make these variables accessible
  var countries;
  var currencies;

  function loadData($){
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

})
