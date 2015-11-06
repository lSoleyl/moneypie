/** Utility module to display ui messages
 *  Usage:
 *    var message = require("utils/message")(<div selector string for messages>)
 *    message.info("works")
 *    message.info("do something after fade", function() { ... })
 */
define(['jquery', 'async'], function($, async) {
  /** Generic message display function
   */
  function showMessage(where, type, message, cb) {
    var messageDiv = $('<div class="alert alert-' + type + '" role="alert">' + message + '</div>')
    messageDiv.hide() 

    $(where).append(messageDiv)
    messageDiv.slideDown(250, function() {
      setTimeout(function() {
        messageDiv.fadeOut(2000, function() {
          messageDiv.remove()
          if (cb)
            async.nextTick(cb)
        })
      }, 2000)
    })
  }

  //Define module function
  return function(messageDivSelectorString) {
    var message = {}

    message.success = function(message, callback) { showMessage(messageDivSelectorString, "success", message, callback) }
    message.info    = function(message, callback) { showMessage(messageDivSelectorString, "info", message, callback) }
    message.error   = function(message, callback) { showMessage(messageDivSelectorString, "danger", message, callback) }

    return message
  }
})
