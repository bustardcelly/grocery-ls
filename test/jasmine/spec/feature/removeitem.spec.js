define(['jquery', 'script/controller/list-controller'], function($, listController) {

  describe('Remove item', function() {

    var $listView = $('<ul/>'),
        groceryItem;

    beforeEach( function() {
      listController.setView($listView);
      groceryItem = listController.createNewItem();
    });

    it('should remove existing item from the collection', function() {
      var collection = listController.getItemList(),
          removedItem;
      
      removedItem = listController.removeItem(groceryItem);

      expect(removedItem).toBe(groceryItem);
      expect(collection.getItemIndex(groceryItem)).toBe(-1);
    });

    it('should remove item renderer from view', function() {
      listController.removeItem(groceryItem);
      
      expect($listView.children().length).toEqual(0);
    });

    afterEach( function() {
      groceryItem = undefined;
    });

  });

});