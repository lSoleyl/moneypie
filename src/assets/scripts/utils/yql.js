/** YQL module to load page content from different origins 
 */
define(['jquery'], function($) {
  return function(url, cb) {

    var yqlurl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url=%22" + url + "%22%20and%20xpath=%22*%22"
    $.ajax(yqlurl, { 
      dataType:"text",
      error: function(x,t,err) { return cb(err) },
      success: function(data) { return cb(null, data) }
    })


  } 
})