define(['jquery', 'lodash', 'visualization/datamap', 'view/addAsset'], function($, _, datamap, addAsset) {
  var routing = {}

  /** Initialization function
   */
  routing.init = function() {

    //Define routes
    var routes = defaultRoutes(['portfolio', 'home', 'about', 'contact'])
    routes.default = 'home'
    routes['portfolio'].routes = { //Define portfolio sub routes
      'overview': navRoute('overview'),
      'list': navRoute('list', {asset:'listAsset.html'}),
      'add': navRoute('add', {asset:'addAsset.html', onLoad: addAsset.onLoad }),
      'edit': navRoute('edit', {asset:'editAsset.html'}),
      'worldmap': navRoute('worldmap', {asset:'datamap.html', 
        onLoad: function() {
          datamap.init('datamap')
        }
      }),      
      default: 'overview' //Default portfolio view
    }

    this.routes = routes //Set routes property
    

    // Register EventListener to Change of URL Hash to keep Browser Navigation
    $(window).on('hashchange', function() { 
      routing.route()
    });
  }

  /** This function will be called an every hash change and can be called manually to 
   *  redisplay the page according to the current location hash
   */
  routing.route = function() {
    // Split Hash to seperate HashLocation (e.g. '#portfolio/overwiew')
    var path = window.location.hash.split('/');
    if (path[0].search('#') == 0) //Strip off hash sign of first element
      path[0] = path[0].substr(1)

    routeTo(path, this.routes)
  }

  /** This function defines a route for the portfolio navigation.
   *   
   * @param navkey the suffix of the nav link id (nav-portfolio-???)
   * @param options
   *
   * @return a route definition for the portfolio nav entry
   */
  function navRoute(navkey, options) {
    options = options || {}
    options = _.defaults(options, { asset:navkey+'.html' })
    var route = {
      deactivate:'a.list-group-item[id^="nav-portfolio-"]',
      activate: 'a#nav-portfolio-' + navkey,
      load: {
        from:'./assets/static/' + options.asset,
        into:'div#mp-portfolio-content',
        id:'mp-portfolio-content-' + navkey
      },
      routes: {}
    }

    if (options.onLoad)
      route.load.onLoad = options.onLoad

    return route
  }

  /** This function defines default routes for the main navigation
   *
   * @param names an array of navigation item names.
   *
   * @return a route object with default route definitions
   */
  function defaultRoutes(names) {
    var routes = {}
    _.each(names, function(name) {
      routes[name] = {
        hide:'div.mp-container',
        show:'div#mp-'+name,

        deactivate:'ul.nav > li',
        activate:'li#nav-'+name,

        routes:{}
      }
    })
    return routes
  }

  /** This function routes recursively to the given path.
   *  Which elements to hide/show/etc. is defined in the routes object.
   *
   * @param path an array of path elements (document.location.hash split by '/')
   * @param routes the routes definition
   */
  function routeTo(path, routes) {
    if ((path.length == 0 || path[0] == '') && routes.default)
      path = [ routes.default ]

    var route = routes[path.shift()]

    if (!route) {
      console.error('View not defined: ', window.location.hash)
      return
    } 

    if (path.length > 0 || route.routes.default)
      routeTo(path, route.routes)

    //First route down, then apply styles
    applyRoute(route)
  }

  /** Actually applies the visual changes, associated with the current route element.
   */
  function applyRoute(route) {
    route = _.defaults(route, {hide:'div.mp-container', deactivate:'ul.nav > li'})

    if (route.hide)
      $(route.hide).addClass('hidden')
    if (route.show)
      $(route.show).removeClass('hidden')

    if (route.deactivate)
      $(route.deactivate).removeClass('active')
    if (route.activate)
      $(route.activate).addClass('active')

    if(route.load) {
      $(route.load.into + "> div").addClass('hidden') //Hide other elements

      var destination = 'div#' + route.load.id
      if ($(destination).length == 0) { //Not yet loaded
        var data = $('<div id="' + route.load.id + '"></div>')
        data.load(route.load.from, function() { //Load content and execute callback (if provided)
          $(route.load.into).append(data)

          if (route.load.onLoad)
            route.load.onLoad()

          if (route.load.onShow)
            route.load.onShow()
        })
      } else { //Was previously loaded, just unhide it
        $(destination).removeClass('hidden')
        if (route.load.onShow)
          route.load.onShow()
      }
    }
  }

  return routing //return module object
})