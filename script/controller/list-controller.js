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
      assignCollectionHandlers = function($collection) {
        var EventKindEnum = collectionFactory.collectionEventKind;
        $collection.on('collection-change', function(event) {
          var model, 
              itemController, 
              $itemController,
              $itemView;
          switch( event.kind ) {
            case EventKindEnum.ADD:
              model = event.items.shift();
              itemController = manageItemInList(model, listController);
              itemController.state = itemControllerFactory.state.EDITABLE;
              $(listController).trigger(createSaveEvent(model));
              break;
            case EventKindEnum.REMOVE:
              model = event.items.shift();
              itemController = listController.getRendererFromItem(model),
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
      },
      manageItemInList = function(item, listController) {
        var $itemView = $('<li>'),
            itemController = itemControllerFactory.create($itemView, item),
            $itemController = $(itemController),
            isValidValue = function(value) {
              return value && (value.hasOwnProperty('length') && value.length > 0);
            };

        $itemView.appendTo(listController.$view);
        rendererList.addItem(itemController);
        
        $itemController.on('remove', function(event) {
          listController.removeItem(item);
        });
        $itemController.on('commit', function(event) {
          if(!isValidValue(item.name)) {
            listController.removeItem(item);
          }
          else {
            $(listController).trigger(createSaveEvent(item));
          }
        });
        return itemController;
      },
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
        },
        setItems: function(items) {
          var i, length = items.length;
          collection = collectionFactory.create();
          for( i = 0; i < length; i++ ) {
            manageItemInList(items[i], this);
            collection.addItem(items[i]);
          }
          assignCollectionHandlers($(collection));
        }
      };

  assignCollectionHandlers($(collection));
  
  return listController;
  
});