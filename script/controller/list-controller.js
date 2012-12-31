define(['jquery', 'script/controller/list-item-controller', 'script/collection/collection', 'script/model/grocery-ls-item'], 
        function($, itemControllerFactory, collectionFactory, modelFactory) {

  var collection = collectionFactory.create(),
      listController = {
        $view: undefined,
        getItemList: function() {
          return collection;
        },
        createNewItem: function() {
          var model = modelFactory.create();
          collection.addItem(model);
          return model;
        },
        setView: function(view) {
          this.$view = (view instanceof $) ? view : $(view);
        }
      };

  (function assignCollectionHandlers($collection) {

    var EventKindEnum = collectionFactory.collectionEventKind;
    $collection.on('collection-change', function(event) {
      switch( event.kind ) {
        case EventKindEnum.ADD:
          var model = event.items.shift(),
              $itemView = $('<li>'),
              itemController = itemControllerFactory.create($itemView, model);

          $itemView.appendTo(listController.$view);
          itemController.state = itemControllerFactory.state.EDITABLE;
          break;
        case EventKindEnum.REMOVE:
          break;
        case EventKindEnum.RESET:
          break;
      }
    });
    
  }($(collection)));

  return listController;
  
});