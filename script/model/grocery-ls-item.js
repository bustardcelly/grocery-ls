define(['jquery'], function($) {
  
  function createPropertyEvent(property, oldValue, newValue) {
    var event = $.Event('property-change');
    event.property = property;
    event.oldValue = oldValue;
    event.newValue = newValue;
    return event;
  }

  return {
    create: function() {
      var item = Object.create(Object.prototype);

      (function(item, id) {
        var name = '',
            marked = false;
        Object.defineProperties(item, {
          "id": {
            value: id,
            writable: true,
            enumerable: true
          },
          "name": {
            enumerable: true, 
            set: function(value) {
              var oldValue = name;
              name = value;
              $(this).trigger(createPropertyEvent('name', oldValue, value));
            },
            get: function() {
              return name;
            }
          },
          "marked": {
            enumerable: true,
            set: function(value) {
              var oldValue = marked;
              marked = value;
              $(this).trigger(createPropertyEvent('marked', oldValue, value));
            },
            get: function() {
              return marked;
            }
          }
        });
      }(item, new Date().getTime()));
      
      return item;
    }
  };

});