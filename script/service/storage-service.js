define(['jquery'], function($) {
  
  var itemCache = [],
      store = {
        saveItem: function(item) {
          var deferred = $.Deferred(),
              index = itemCache.indexOf(item);
          if(index === -1) {
            itemCache[itemCache.length] = item;
          }
          return deferred.resolve(item);
        },
        removeItem: function(item) {
          var deferred = $.Deferred(),
              itemIndex = itemCache.indexOf(item),
              removedItem;

          if(itemIndex > -1) {
            itemCache.splice(itemIndex, 1);
            removedItem = item;
          }
          return deferred.resolve(removedItem);
        },
        getItems: function() {
          var deferred = $.Deferred();
          deferred.resolve(itemCache);
          return deferred;
        },
        empty: function() {
          var deferred = $.Deferred();
          itemCache.length = 0;
          deferred.resolve(itemCache);
          return deferred;
        }
      };

  return store;

});