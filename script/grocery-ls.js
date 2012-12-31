(function(window, require) {

  require.config({
    baseUrl: ".",
    paths: {
      "lib": "./lib",
      "script": "./script",
      "jquery": "./lib/jquery-1.8.3.min"
    }
  });

  require( ['jquery', 'script/controller/list-controller', 'script/collection/collection'], 
            function($, listController, collectionFactory) {
    
    listController.setView($('section.groceries ul'));
    $('section.groceries #add-item-button').on('click', function(event) {
      listController.createNewItem();
    });

  });

}(window, requirejs));