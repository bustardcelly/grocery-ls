define(['jquery', 'script/controller/list-controller', 'script/model/grocery-ls-item'], 
        function($, listController, modelFactory) {
  
  describe('Grocery List list-controller', function() {

    describe('getRendererItem()', function() {

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

  });

});