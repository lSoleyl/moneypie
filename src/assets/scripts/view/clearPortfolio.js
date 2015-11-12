define(['jquery', 'portfolio', 'model', 'utils/message'], function($, portfolio, model) {
  var view = {}

  var message = require('utils/message')('div#clearPortfolioMessages')

  view.onLoad = function() {
    $("#clearPortfolioSubmit").click(function() {
      portfolio.assets = []
      portfolio.save()
      message.success("Portfolio has been successfully cleared")
    })

    $("#clearPortfolioLoadTest").click(function() {
      $.getJSON("./assets/data/testPortfolio.json", function(assets) {
        portfolio.load(assets)
        portfolio.save()
        message.success("Test portfolio loaded")
      })      
    })
  }

  return view
})