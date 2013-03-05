define(['jquery', 'script/controller/list-controller', 'script/controller/list-item-controller'], 
        function($, listController, itemControllerFactory) {
  
  describe('Save item to grocery list', function() {

    var $listView = $('<ul/>'),
        item,
        itemName = 'apples',
        invalidName = '',
        itemRenderer,
        async = new AsyncSpec(this);

    beforeEach( function() {
      listController.setView($listView);
      item = listController.createNewItem();
      itemRenderer = listController.getRendererFromItem(item);
    });

    async.it('should not save an empty item to the list', function(done) {
      var listLength = listController.getItemList().itemLength();
      
      $(itemRenderer).on('commit', function(event) {
        expect(listController.getItemList().itemLength()).toEqual(listLength - 1);
        done();
      });

      item.name = invalidName;
      itemRenderer.save();
    });

    async.it('should not save an empty item upon change to non-edit mode', function(done) {
       var listLength = listController.getItemList().itemLength();
      
      $(itemRenderer).on('commit', function(event) {
        expect(listController.getItemList().itemLength()).toEqual(listLength - 1);
        done();
      });

      item.name = invalidName;
      itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    });

    async.it('should not add an empty item to list view upon change to non-edit mode', function(done) {
       var listViewLength = $listView.children().length;
      
      $(itemRenderer).on('commit', function(event) {
        expect($listView.children().length).toEqual(listViewLength - 1);
        done();
      });

      item.name = invalidName;
      itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    });

    async.it('should save a valid item upon change to non-edit mode', function(done) {
       var listLength = listController.getItemList().itemLength();
      
      $(itemRenderer).on('commit', function(event) {
        expect(listController.getItemList().itemLength()).toEqual(listLength);
        done();
      });

      item.name = itemName;
      itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    });

    async.it('should add a valid item to list view upon change to non-edit mode', function(done) {
      var listViewLength = $listView.children().length;
      
      $(itemRenderer).on('commit', function(event) {
        expect($listView.children().length).toEqual(listViewLength);
        done();
      });

      item.name = itemName;
      itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    });

    async.it('should dispatch a save-item event', function(done) {
      
      $(listController).on('save-item', function(event) {
        expect(event.item).toEqual(item);
        $(listController).off('save-item');
        done();
      });

      item.name = itemName;
      itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    });

    afterEach( function() {
      item = undefined;
      itemRenderer = undefined;
      $listView.empty();
    });

  });

});