define(function() {
  var itemProperties = function(id) {
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
          }
        };
      },
      listController = {
        itemList: [],
        editableItem: undefined,
        createNewItem: function() {
          this.editableItem = Object.create(Object.prototype, itemProperties(new Date().getTime()));
        },
        editFocusedItem: function(name) {
          this.editableItem.name = name;
        },
        saveFocusedItem: function() {
          if( this.editableItem.name.length !== 0 ) {
            this.itemList.push(this.editableItem);
          }
          this.editableItem = undefined;
        }
      };

  return listController;
})