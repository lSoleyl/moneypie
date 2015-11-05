/** Storage module which works much like redis and is backed by
 *  local storage.
 */
define([], function() {
  var storage = {}
  var cache = {}

  storage.save = function(key,value) {
    cache[key] = value
    localStorage.setItem(key,JSON.stringify(value))
  }

  storage.load = function(key) {
    if (cache[key])
      return cache[key]

    cache[key] = JSON.parse(localStorage.getItem(key))
    return cache[key]
  }

  return storage
})