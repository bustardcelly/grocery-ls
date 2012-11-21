(function(window, require) {

  require.config({
    baseUrl: ".",
    paths: {
      "lib": "./lib",
      "script": "./script",
      "jquery": "./lib/jquery-1.8.3.min"
    }
  });

  require( ['jquery', 'script/controller/list-controller'], function($, listController) {
    listController.setView($('section.groceries'));
  });

}(window, requirejs));