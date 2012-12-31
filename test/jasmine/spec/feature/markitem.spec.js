define(['script/controller/list-controller'], function(listController) {
  
  describe('User Requests to mark-off existing item', function() {

    var name = 'apples',
        savedItem, 
        markOffSpy,
        unmarkOffSpy;

    beforeEach( function() {
      listController.createNewItem();
      listController.editFocusedItem(name);
      listController.saveFocusedItem();

      savedItem = listController.itemList[listController.itemList.length-1];

      markOffSpy = spyOn(listController, "markOffItem").andCallThrough();
      unmarkOffSpy = spyOn(listController, "unmarkOffItem").andCallThrough();
    });

    it('should denote item as being in possession', function() {
      var previouslySavedItem = savedItem,
          savedItemID = savedItem.id,
          savedItemSpy = sinon.spy();

      savedItemSpy(previouslySavedItem);
      listController.markOffItem(savedItemID);

      // spy expectations.
      expect(markOffSpy).toHaveBeenCalled();
      expect(markOffSpy).toHaveBeenCalledWith(savedItemID);

      // model expectations.
      expect(previouslySavedItem.hasOwnProperty('marked')).toBe(true);
      expect(previouslySavedItem.marked).toBe(true);
      // OR >
      sinon.assert.calledWith(savedItemSpy, sinon.match.hasOwn('marked', true));
    });

    it('should retain the item in the grocery list', function() {
      listController.markOffItem(savedItem.id);
      // indexOf requires JavaScript 1.6 
      // https://developer.mozilla.org/en-US/docs/JavaScript/New_in_JavaScript/1.6
      // But since we are not concerning ourselves with less than modern browsers we are ok.
      
      expect(listController.itemList.length).toBe(1);
      expect(listController.itemList.indexOf(savedItem)).toBe(0);
    });

    it('should have marked-off item available to unmark-off', function() {
      var previouslySavedItem = savedItem,
          savedItemID = savedItem.id;

      listController.markOffItem(savedItem.id);
      listController.unmarkOffItem(savedItem.id);

      // stubbed expectations.
      expect(unmarkOffSpy).toHaveBeenCalled();
      // model expectations.
      expect(previouslySavedItem.marked).not.toBe(true);
    });

    afterEach( function() {
      savedItem = undefined;
      markOffSpy.reset();
      unmarkOffSpy.reset();
      listController.itemList = [];
      listController.editableItem = undefined;
    });

  });

});