define(['jquery', 'portfolio', 'utils/message'], function($, portfolio) {
  var view = {}

  var message = require('utils/message')('div#clearPortfolioMessages')

  view.onLoad = function() {
    $("#clearPortfolioSubmit").click(function() {
      portfolio.assets = []
      portfolio.save()
      message.success("Portfolio has been successfully cleared")
    })
  }

  return view
})