define(['jquery', 'script/model/grocery-ls-item'], function($, modelFactory) {
  
  function createStateEvent(oldState, newState) {
    var event = new $.Event('state-change');
    event.oldState = oldState;
    event.newState = newState;
    return event;
  }

  var itemControllerFactory = {
        create: function(node, model) {
          var itemController = Object.create(Object.prototype);

          (function(controller, stateEventCreator) {
            var _state = 'normal';
            Object.defineProperties(controller, {
              "model": {
                value: model,
                writable: false,
                enumerable: true
              },
              "parentView": {
                value: node,
                writable: false,
                enumerable: true
              },
              "state": {
                set: function(value) {
                  var event = stateEventCreator.call(this, this.state, value);
                  _state = value;
                  $(this).trigger(event);
                },
                get: function() {
                  return _state;
                }
              }
            });
          }(itemController, createStateEvent));
          
          return itemController;
        }
      },
      parentNode = $('<li>');

  describe('Grocery list-item-controller', function() {

    var model,
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
        expect(nextController.state).not.toBe(newController.state);
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

          expect(event.oldState).toBe(previousState);
          expect(event.newState).toBe(newState);
          expect(newController.state).toBe(newState);
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