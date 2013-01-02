define(['jquery', 'script/model/grocery-ls-item', 'script/controller/list-item-controller'], 
          function($, modelFactory, itemControllerFactory) {

  describe('Grocery list-item-controller', function() {

    var model,
        parentNode = $('<li>'),
        newController,
        async = new AsyncSpec(this);

    beforeEach( function() {
      model = modelFactory.create();
      newController = itemControllerFactory.create(parentNode, model);
    });

    describe('list-item-controller factory creation', function() {
      
      it('should return a new instance of list-item-controller', function() {
        expect(newController).not.toBeUndefined();
      });

      it('should return unique instances of list-item-controllers', function() {
        var nextController = itemControllerFactory.create(parentNode, model);
        nextController.state = 'testing';
        expect(nextController).not.toBe(newController);
        expect(nextController.state).not.toEqual(newController.state);
      });

    });

    describe('new list-item-controller instance', function() {
      
      it('should expose model provided in creation', function() {
        expect(newController.model).not.toBeUndefined();
        expect(newController.model).toBe(model);
      });

      it('should expose non-writable model', function() {
        var newModel = modelFactory.create();
        newController.model = newModel;
        expect(newController.model).not.toBe(newModel);
        expect(newController.model).toBe(model);
      });

      describe('list-item-controller notifies on state-change', function() {

        async.it('should provide old and new state values on state-change', function(done) {
          var previousState = newController.state,
              newState = 'editable';

          $(newController).on('state-change', function(event) {
            $(newController).off('state-change');

            expect(event.oldState).toEqual(previousState);
            expect(event.newState).toEqual(newState);
            expect(newController.state).toEqual(newState);
            done();
          });
          newController.state = newState;
        });

      });

    });

    afterEach( function() {
      model = undefined;
      newController = undefined;
    });

  });

});