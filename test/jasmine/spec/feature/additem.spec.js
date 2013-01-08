define(['jquery', 'script/controller/list-controller', 'script/controller/list-item-controller'], 
        function($, listController, itemControllerFactory) {
  
  describe('New item creation from listController.createNewItem()', function() {

    var $listView = $('<ul/>');

    beforeEach( function() {
      listController.setView($listView);
    });

    it('should return newly created model', function() {
      var newItem = listController.createNewItem();
      // loosely (duck-ly) verifying grocery-ls-item type.
      expect(newItem).toEqual(jasmine.any(Object));
      expect(newItem.hasOwnProperty('name')).toEqual(true);
      expect(newItem.hasOwnProperty('id')).toEqual(true);
      expect(newItem.id).not.toBeUndefined();
    });

    it('should add newly created item to collection', function() {
      var newItem = listController.createNewItem(),
          itemList = listController.getItemList();
      expect(itemList.itemLength()).not.toEqual(0);
      expect(itemList.getItemAt(itemList.itemLength()-1)).toBe(newItem);
    });

    it('should add new item controller to view', function() {
      listController.createNewItem();
      expect($listView.children().length).toEqual(1);
    });

    it('should enable associated item renderer as editable', function() {
      var newItem = listController.createNewItem(),
          itemRenderer = listController.getRendererFromItem(newItem);

        expect(itemRenderer).not.toBeUndefined();
        expect(itemRenderer.model).toBe(newItem);
        expect(itemRenderer.state).toEqual(itemControllerFactory.state.EDITABLE);
        expect($listView.children()[0]).toBe(itemRenderer.parentView.get(0));
    });

    afterEach( function() {
      $listView.empty();
    });

  });

});