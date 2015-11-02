/* Custom DataMap Visualization Script Resource */

$(function(){
  console.log('Creating DataMap...');

  // Workaround to make sure, dependencies are already loaded
  // TODO Check for d3.js resources as well
  waitForDatamapResource(constructDataMap, 200);

});

var worldMap;

/**
 * Construct DataMap
 */
function constructDataMap(){
  //console.log('Constructing DataMap');

  worldMap = new Datamap({
    element: document.getElementById("datamap")
  });

}

/**
 * Wait for Datamap Resource to be loaded
 * @param callback Function to be executed, once DataMap Function is available
 * @param timeout Timeout Value in ms
 */
function waitForDatamapResource(callback, timeout){
  //console.log('Waiting for Resource: timeout='+timeout);

  // Test Resource availability by Type comparison
  if(typeof(Datamap) != 'function'){

    // Set Timeout
    setTimeout(function(){
      waitForDatamapResource(callback, timeout);
    }, timeout);

  } else {

    // Run Callback function
    callback();
  }
}
