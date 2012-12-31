define(['jquery', 'script/controller/list-controller', 'script/controller/list-item-controller', 
        'script/collection/collection', 'script/model/grocery-ls-item'], 
        function($, listController, itemControllerFactory, collectionFactory, modelFactory) {
  
  describe('New item creation from listController.createNewItem()', function() {

    var newModel,
        newItemController,
        listControllerStub,
        $listView = $('<ul/>'),
        itemCollection = collectionFactory.create();

    beforeEach( function() {
      var $itemView = $('<li>');

      newModel = modelFactory.create();
      newItemController = itemControllerFactory.create($itemView, newModel);

      listControllerStub = sinon.stub(listController, 'createNewItem', function() {
        listController.getItemList().addItem(newModel);
        $itemView.appendTo($listView);
        return newModel;
      });
      listController.getItemList = sinon.stub().returns(itemCollection);
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
      newModel = undefined;
      newItemController = undefined;
      itemCollection.removeAll();
      listController.createNewItem.restore();
    });

  });

});