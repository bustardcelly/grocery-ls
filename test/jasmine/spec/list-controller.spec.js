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

  });

});