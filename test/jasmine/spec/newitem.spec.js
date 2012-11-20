define( function() {

  describe('User requests to add new item', function() {

    var service = {
          addItem: function(value) {
          }
        },
        listController = {
          service: service,
          editableItem: undefined,
          addEditableItemToList: function() {
            this.editableItem = Object.create(null);
          },
          saveEditableItem: function() {
            return service.addItem(this.editableItem);
          }
        },
        addItemStub,
        async = new AsyncSpec(this);

    beforeEach( function() {
      addItemStub = sinon.stub( service, "addItem", function() {
        return {
          on: function( responseType, handler ) {
            var timeout = setTimeout( function() {
              clearTimeout(timeout);
              handler.call(null, true);
            }, 1000);
          }
        };
      });
    });

    it('should create a new editable item', function() {
      var editableItem = listController.addEditableItemToList();
      expect(listController.editableItem).not.toBeUndefined();
      expect(service.addItem.called).toBe(false);
    });

    async.it('should save new item last created', function(done) {
      var request;
      listController.addEditableItemToList();
      request = listController.saveEditableItem();
      request.on( 'complete', function(result) {
        expect(service.addItem.calledOnce).toBe(true);
        expect(service.addItem.calledWith(listController.editableItem)).toBe(true);
        done();
      });
    });

    afterEach( function() {
      addItemStub.restore();
      listController.editableItem = undefined;
    });

  });

});