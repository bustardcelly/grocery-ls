define( ['script/controller/list-controller'], function(listController) {
  
  var itemName = 'apples';

  describe('List Controller creates a new item', function() {

    beforeEach( function() {
      listController.createNewItem();
    });

    it('should expose the editableItem upon creation', function() {
      expect(listController.editableItem).not.toBeUndefined();
    });

    afterEach( function() {
      listController.editableItem = undefined;
    });

  });

  describe('User requests to add new item', function() {

    beforeEach( function() {
      listController.createNewItem();
      listController.editFocusedItem(itemName);
      listController.saveFocusedItem();
    });

    it('should save new item when name supplied', function() {
      expect(listController.itemList.length).toBe(1);
      expect(listController.itemList[0]).not.toBe(undefined);
      expect(listController.itemList[0].hasOwnProperty('name')).toBe(true);
      expect(listController.itemList[0].name).toBe(itemName);
    });

    it('should not save new item when name not supplied', function() {
      listController.createNewItem();
      listController.saveFocusedItem();
      expect(listController.itemList.length).toBe(1);
      expect(listController.itemList[0].name).toBe(itemName);
    });

    afterEach( function() {
      listController.itemList = [];
      listController.editableItem = undefined;
    });

  });

});