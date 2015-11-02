/**
 * Initialize Routing for Single Page Application
 */
function initRouting(){

  // Register EventListener to Change of URL Hash to keep Browser Navigation
  $(window).on('hashchange', function() {
    //console.log('Pathname Changed'+window.location.hash);

    // Split Hash to seperate HashLocation (e.g. '#portfolio/overwiew')
    //TODO Hanlde deeper Subsections
    var hashLocation = window.location.hash.split('/');

    switch (hashLocation[0]){
      case '#portfolio':
        showPortfolio(hashLocation.length>1? hashLocation[1] : null);
        break;
      case '#home':
        showHome();
        break;
      case '#about':
        showAbout();
        break;
      case '#contact':
        showContact();
        break;
      default:
        console.error('View not defined: ', window.location.hash);
    }

    //.. work ..
  });
}

/**
 * Show Home Page
 */
function showHome(){
  //console.log('Showing Home');

  // Hide all containers
  $('div.mp-container').addClass('hidden');

  // Show Home
  $('div#mp-home').removeClass('hidden');

  // Set Navigation
  $('ul.nav > li').removeClass('active');
  $('li#nav-home').addClass('active');
}

/**
 * Show Portfolio Page
 * @param subsection Routing Subsection
 * TODO Handle deeper Subsections
 */
function showPortfolio(subsection){
  //console.log('Showing Portfolio', 'Subsection: '+subsection);

  // Parse and route Subsection
  $('a.list-group-item[id^="nav-portfolio-"]').removeClass('active');

  if(!subsection || subsection === 'overview'){
    //console.log('Showing Overview');
    $('a#nav-portfolio-overview').addClass('active');
    $('div#mp-portfolio-content').load('./assets/static/overview.html');

  } else if(subsection && subsection === 'worldmap'){
    //console.log('Showing List Asset');
    $('a#nav-portfolio-worldmap').addClass('active');
    $('div#mp-portfolio-content').load('./assets/static/datamap.html');

  } else if(subsection && subsection === 'list'){
    //console.log('Showing List Asset');
    $('a#nav-portfolio-list').addClass('active');
    $('div#mp-portfolio-content').load('./assets/static/listAsset.html');

  } else if(subsection && subsection === 'add'){
    //console.log('Showing Add Asset');
    $('a#nav-portfolio-add').addClass('active');
    $('div#mp-portfolio-content').load('./assets/static/addAsset.html');

  } else if(subsection && subsection === 'edit'){
    //console.log('Showing Edit Asset');
    $('a#nav-portfolio-edit').addClass('active');
    $('div#mp-portfolio-content').load('./assets/static/editAsset.html');

  } else if(subsection){
    console.error('Unknown Subsection: '+subsection);
  }

  // Hide all containers
  $('div.mp-container').addClass('hidden');

  // Show Portfolio
  $('div#mp-portfolio').removeClass('hidden');

  // Set Navigation
  $('ul.nav > li').removeClass('active');
  $('li#nav-portfolio').addClass('active');
}

/**
 * Show About Page
 */
function showAbout(){
  //console.log('Showing About');

  // Hide all containers
  $('div.mp-container').addClass('hidden');

  // Show Portfolio
  $('div#mp-about').removeClass('hidden');

  // Set Navigation
  $('ul.nav > li').removeClass('active');
  $('li#nav-about').addClass('active');
}

/**
 * Show Contact Page
 */
function showContact(){
  //console.log('Showing Contact');

  // Hide all containers
  $('div.mp-container').addClass('hidden');

  // Show Portfolio
  $('div#mp-contact').removeClass('hidden');

  // Set Navigation
  $('ul.nav > li').removeClass('active');
  $('li#nav-contact').addClass('active');
}
