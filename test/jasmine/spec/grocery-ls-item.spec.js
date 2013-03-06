define(['jquery', 'script/model/grocery-ls-item'], function($, modelFactory) {
  
  describe('Grocery List grocery-ls-item model', function() {

    var model,
        name = 'grapes',
        async = new AsyncSpec(this);

    beforeEach( function() {
      model = modelFactory.create();
      model.name = name;
      model.marked = false;
    });

    describe('grocery-ls-item factory model creation', function() {

      it('should generate unique instances of model', function() {
        var newModel = modelFactory.create();
        expect(model).not.toBeUndefined();
        expect(newModel).not.toBeUndefined();
        expect(model).not.toBe(newModel);
      });

      async.it('should auto generate unique ids on models', function(done) {
        var newModel,
            creationTimeout;

        // Offload creation because ids are generated based on time. 
        // This allows for timestamp to progess.
        creationTimeout = setTimeout(function() {
          clearTimeout(creationTimeout);
          newModel = modelFactory.create();
          expect(model.id).not.toBeUndefined();
          expect(typeof model.id).toEqual('number');
          expect(model.id).not.toEqual(newModel.id);
          done();
        }, 100);
      });
      
    });

    describe('grocery-ls-item property change notification', function() {

      async.it('should notify with \'property-change\' upon change to name property', function(done) {
        var oldName = model.name,
            newName = 'apples';
        $(model).on('property-change', function(event) {
          expect(event.property).toEqual('name');
          expect(event.oldValue).toEqual(oldName);
          expect(event.newValue).toEqual(newName);
          $(model).off('property-change');
          done();
        });
        model.name = newName;
      });

      async.it('should notify with \'property-change\' upon change to marked property', function(done) {
        var oldValue = model.marked,
            newValue = true;
        $(model).on('property-change', function(event) {
          expect(event.property).toEqual('marked');
          expect(event.oldValue).toEqual(oldValue);
          expect(event.newValue).toEqual(newValue);
          $(model).off('property-change');
          done();
        });
        model.marked = newValue;
      });

    });

    afterEach( function() {
      model = undefined;
    });

  });

});