define(['jquery', 'script/controller/list-controller', 'script/model/grocery-ls-item'], 
        function($, listController, modelFactory) {
  
  describe('Grocery List list-controller', function() {

    describe('getRendererFromItem()', function() {

      it('should return renderer associated with model', function() {
        var itemModel, renderer;

        itemModel = listController.createNewItem();
        renderer = listController.getRendererFromItem(itemModel);
        expect(renderer).not.toBeUndefined();
        expect(renderer.model).toBe(itemModel);
      });

      it('should return undefined with no associated model', function() {
        var itemModel, renderer;

        itemModel = modelFactory.create();
        renderer = listController.getRendererFromItem(itemModel);
        expect(renderer).toBeUndefined();
      });

    });

    describe('list-item-controller remove event response', function() {

      it('should invoke list-controller:removeItem()', function() {
        var newItem = listController.createNewItem(),
            itemRenderer = listController.getRendererFromItem(newItem);

        spyOn(listController, 'removeItem');
        $(itemRenderer).trigger('remove');
        expect(listController.removeItem).toHaveBeenCalledWith(newItem);
      });

    });

    describe('setItems()', function() {

      var itemOne = modelFactory.create(),
          itemTwo = modelFactory.create(),
          async = new AsyncSpec(this);

      beforeEach( function() {
        itemOne.name = 'apples';
        itemTwo.name = 'oranges';
        listController.setItems([itemOne, itemTwo]);
      });

      afterEach( function() {
        listController.getItemList().removeAll();
      });

      it('should fill list with provided items', function() {
        var items = listController.getItemList();
        expect(items.itemLength()).toEqual(2);
        expect(items.getItemAt(0)).toBe(itemOne);
        expect(items.getItemAt(1)).toBe(itemTwo);
      });

      async.it('should dispatch events of property-change from provided items', function(done) {
        var items = listController.getItemList(),
            itemOne = items.getItemAt(0);
        $(listController).on('save-item', function(event) {
          $(listController).off('save-item');
          expect(event.item).toBe(itemOne);
          done();
        });
        itemOne.marked = true;
      });

      async.it('should dispatch event of remove-item from collection', function(done) {
        $(listController).on('remove-item', function(event) {
          $(listController).off('remove-item');
          expect(event.item).toBe(itemOne);
          done();
        });
        listController.removeItem(itemOne);
      });

    });

  });

});