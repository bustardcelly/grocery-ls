define(['jquery', 'script/model/grocery-ls-item'], function($, modelFactory) {
  
  var itemCache,
      groceryListKey = 'com.custardbelly.grocerylist',
      parseToCollection = function(json) {
        var i,
            length,
            list = (json && typeof json === 'string') ? JSON.parse(json) : [];

        for(i = 0; i < length; i++) {
          list[i] = $.extend(modelFactory.create(), list[i]);
        }
        return list;
      },
      serialize = function(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
      },
      store = {
        saveItem: function(item) {
          var deferred = $.Deferred();
          $.when(this.getItems()).then(function(cache) {
            var index = cache.indexOf(item);
            try {
              if(index === -1) {
                cache[cache.length] = item;
              }
              serialize(groceryListKey, cache);
              deferred.resolve(item);
            }
            catch(e) {
              deferred.reject('Could not save item: ' + e.message);
            }
          });
          return deferred;
        },
        removeItem: function(item) {
          var deferred = $.Deferred();
          $.when(this.getItems()).then(function(cache) {
            var itemIndex = cache.indexOf(item),
                removedItem;
            try {
              if(itemIndex > -1) {
                cache.splice(itemIndex, 1);
                removedItem = item;
                serialize(groceryListKey, cache);
              }
              deferred.resolve(removedItem);
            }
            catch(e) {
              cache.splice(itemIndex, 0, removedItem);
              deferred.reject('Could not remove item: ' + e.message);
            }
          });
          return deferred;
        },
        getItems: function() {
          var deferred = $.Deferred();
          if(itemCache === undefined) {
             try {
              itemCache = parseToCollection(window.localStorage.getItem(groceryListKey));
              deferred.resolve(itemCache);
            }
            catch(e) {
              deferred.reject('Could not access items: ' + e.message);
            }
          }
          else {
            deferred.resolve(itemCache);
          }
          return deferred;
        },
        empty: function() {
          var deferred = $.Deferred();
          $.when(this.getItems()).then(function(cache) {
            try {
              cache.length = 0;
              serialize(groceryListKey, cache);
              deferred.resolve(cache);
            }
            catch(e) {
              deferred.reject('Could not empty cache: ' + e.message);
            }
          });
          return deferred;
        }
      };

  return store;

});