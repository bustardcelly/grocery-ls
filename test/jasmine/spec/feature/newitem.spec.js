define(['jquery', 'script/controller/list-controller'], 
        function($, listController) {
  
  describe('New item creation from listController.createNewItem()', function() {

    var $listView = $('<ul/>');

    beforeEach( function() {
      listController.setView($listView);
    });

    it('should return newly created model', function() {
      var newItem = listController.createNewItem();
      // loosely (duck-ly) verifying grocery-ls-item type.
      expect(newItem).toEqual(jasmine.any(Object));
      expect(newItem.hasOwnProperty('name')).toBe(true);
      expect(newItem.hasOwnProperty('id')).toBe(true);
      expect(newItem.id).not.toBeUndefined();
    });

    it('should add newly created item to collection', function() {
      var newItem = listController.createNewItem(),
          itemList = listController.getItemList();
      expect(itemList.itemLength()).not.toBe(0);
      expect(itemList.getItemAt(itemList.itemLength()-1)).toEqual(newItem);
    });

    it('should add new item controller to view', function() {
      listController.createNewItem();
      expect($listView.children().length).toBe(1);
    });

    afterEach( function() {
      $listView.empty();
    });

  });

});