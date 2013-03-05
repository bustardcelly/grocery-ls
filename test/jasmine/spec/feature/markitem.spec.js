define(['jquery', 'script/controller/list-controller'], 
        function($, listController) {
  
  describe('Existing item is marked-off', function() {

    var item,
        async = new AsyncSpec(this);

    beforeEach( function() {
      item = listController.createNewItem();
      item.name = 'apples';
    });

    it('should denote item as being in possession', function() {
      var itemRenderer = listController.getRendererFromItem(item);
          savedItemSpy = sinon.spy();

      savedItemSpy(itemRenderer.model);
      item.marked = true;

      // model expectations.
      expect(item.marked).toEqual(true);
      sinon.assert.calledWith(savedItemSpy, sinon.match.hasOwn('marked', true));
    });

    it('should retain the item in the grocery list collection', function() {
      var itemIndex = listController.getItemList().getItemIndex(item);

      item.marked = true;
      // ensure that change to marked property does not remove from list.
      expect(listController.getItemList().getItemIndex(item)).toEqual(itemIndex);
    });

    it('should retain item in renderer listing regardless of marked-off status', function() {
      var itemRenderer = listController.getRendererFromItem(item),
          itemIndex = listController.getItemList().getItemIndex(item);

      item.marked = true;
      item.marked = false;
      // ensure that marking and unmarking retauns item in list and has proper value.
      expect(itemRenderer.model.marked).toEqual(false);
      expect(listController.getItemList().getItemIndex(item)).toEqual(itemIndex);
    });

    async.it('should dispatch a save-item event', function(done) {

      var timeout = setTimeout(function() {
        clearTimeout(timeout);
        $(listController).off('save-item');
      }, jasmine.DEFAULT_TIMEOUT_INTERNAL);

      $(listController).on('save-item', function(event) {
        expect(event.item).toBe(item);
        $(listController).off('save-item');  
        done();
      });

      item.marked = true;
    });

    afterEach( function() {
      item = undefined;
    });

  });

});