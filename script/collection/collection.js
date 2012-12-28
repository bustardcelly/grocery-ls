define(['jquery'], function($) {

  function createEvent(kind, items) {
    var event = $.Event('collection-change');
    event.kind = kind;
    event.items = items;
    return event;
  }
  
  var _collectionEventKind = {
        ADD: 'add',
        REMOVE: 'remove',
        RESET: 'reset'
      },
      collection = {
        itemLength: function() {
          return this.list.length;
        },
        addItem: function(item) {
          this.list.push(item);
          $(this).trigger(createEvent(_collectionEventKind.ADD, [item]));
          return item;
        },
        removeItem: function(item) {
          var index = this.getItemIndex(item);
          if( index > -1 ) {
            this.list.splice(index, 1);
            $(this).trigger(createEvent(_collectionEventKind.REMOVE, [item]));
            return item;
          }
          return undefined;
        },
        removeAll: function() {
          this.list.length = 0;
          $(this).trigger(createEvent(_collectionEventKind.RESET, this.list));
        },
        getItemAt: function(index) {
          if( index < 0 || (index > this.itemLength() - 1) ) {
            return undefined;
          }
          return this.list[index];
        },
        getItemIndex: function(item) {
          return this.list.indexOf(item);
        },
        contains: function(item) {
          return this.getItemIndex(item) != -1;
        }
      };

  return {
    collectionEventKind: _collectionEventKind,
    create: function(source) {
      var instance = Object.create(collection);
      Object.defineProperty(instance, "list", {
          value: Array.isArray(source) ? source : [],
          writable: true,
          enumerable: true
      });
      return instance;
    }
  };
  
});