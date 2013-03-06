(function(window, require) {

  require.config({
    baseUrl: ".",
    paths: {
      "lib": "./lib",
      "script": "./script",
      "jquery": "./lib/jquery-1.8.3.min"
    }
  });

  require( ['jquery', 'script/controller/list-controller', 'script/service/storage-service'], 
            function($, listController, storageService) {
    
    var $listController = $(listController);
    listController.setView($('section.groceries ul'));

    storageService.getItems().then(function(items) {
      listController.setItems(items);
    });
    $listController.on('save-item', function(event) {
      storageService.saveItem(event.item).then(function(item) {
        console.log('Item saved! ' + item.name);
      }, function(error) {
        console.log('Item not saved: ' + error)
      });
    });
    $listController.on('remove-item', function(event) {
      storageService.removeItem(event.item).then(function(item) {
        console.log('Item removed! ' + item.name);
      }, function(error) {
        console.log('Item not removed: ' + error);
      });
    });
    $('#add-item-button').on('click', function(event) {
      listController.createNewItem();
    });

  });

}(window, requirejs));