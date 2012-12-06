define(function() {
  
  var properties = function(id) {
    return {
      "id": {
        value: id,
        writable: false,
        enumerable: true
      },
      "name": {
        value: '',
        writable: true,
        enumerable: true
      },
      "marked": {
        value: false,
        writable: true,
        enumerable: true
      }
    };
  };

  return {
    create: function() {
      return Object.create(Object.prototype, properties(new Date().getTime()));
    }
  };

});