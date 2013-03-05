define(['jquery', 'script/controller/list-item-controller', 'script/collection/collection', 'script/model/grocery-ls-item'], 
        function($, itemControllerFactory, collectionFactory, modelFactory) {

  function createSaveEvent(item) {
    var event = $.Event('save-item');
    event.item = item;
    return event;
  }

  function createRemoveEvent(item) {
    var event = $.Event('remove-item');
    event.item = item;
    return event;
  }

  var collection = collectionFactory.create(),
      rendererList = collectionFactory.create(),
      listController = {
        $view: undefined,
        getItemList: function() {
          return collection;
        },
        getRendererFromItem: function(item) {
          var i = rendererList.itemLength();
          while( --i > -1 ) {
            if(rendererList.getItemAt(i).model === item) {
              return rendererList.getItemAt(i);
            }
          }
          return undefined;
        },
        createNewItem: function() {
          var model = modelFactory.create();
          collection.addItem(model);
          return model;
        },
        removeItem: function(item) {
          return collection.removeItem(item);
        },
        setView: function(view) {
          this.$view = (view instanceof $) ? view : $(view);
        }
      };

  (function assignCollectionHandlers($collection, $rendererList) {

    var EventKindEnum = collectionFactory.collectionEventKind,
        isValidValue = function(value) {
          return value && (value.hasOwnProperty('length') && value.length > 0);
        };

    $collection.on('collection-change', function(event) {
      var model, 
          itemController, 
          $itemController,
          $itemView;
      switch( event.kind ) {
        case EventKindEnum.ADD:
          $itemView = $('<li>');
          model = event.items.shift();
          itemController = itemControllerFactory.create($itemView, model);
          $itemController = $(itemController);

          $itemView.appendTo(listController.$view);
          rendererList.addItem(itemController);
          $(listController).trigger(createSaveEvent(model));
          itemController.state = itemControllerFactory.state.EDITABLE;
          $itemController.on('remove', function(event) {
            listController.removeItem(model);
          });
          $itemController.on('commit', function(event) {
            if(!isValidValue(model.name)) {
              listController.removeItem(model);
            }
            else {
              $(listController).trigger(createSaveEvent(model));
            }
          });
          break;
        case EventKindEnum.REMOVE:
          model = event.items.shift();
          itemController = listController.getRendererFromItem(model);
          $itemController = $(itemController);
          
          if(itemController) {
            $itemView = itemController.parentView;
            $itemView.remove();
            itemController.dispose();
            $itemController.off('remove');
            $itemController.off('commit');
            rendererList.removeItem(itemController);
            $(listController).trigger(createRemoveEvent(model));
          }
          break;
        case EventKindEnum.RESET:
          break;
      }
    });
    
  }($(collection), $(rendererList)));

  return listController;
  
});