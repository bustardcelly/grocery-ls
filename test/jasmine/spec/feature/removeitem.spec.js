define(['jquery', 'script/controller/list-controller'], function($, listController) {

  describe('Remove item', function() {

    var $listView = $('<ul/>'),
        groceryItem,
        async = new AsyncSpec(this);

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

    async.it('should dispatch a remove-item event', function(done) {
      var removedItem;

      $(listController).on('remove-item', function(event) {
        expect(event.item).not.toBeUndefined();
        $(listController).off('remove-item');
        done();
      });
      removedItem = listController.removeItem(groceryItem);
    });

    afterEach( function() {
      groceryItem = undefined;
    });

  });

});