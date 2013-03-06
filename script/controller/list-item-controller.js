define(['jquery'], function($) {
  
  function createStateEvent(oldState, newState) {
    var event = $.Event('state-change');
    event.oldState = oldState;
    event.newState = newState;
    return event;
  }

  function createRemoveEvent(controller) {
    var event = $.Event('remove');
    event.controller = controller;
    return event;
  }

  function createSaveEvent(controller) {
    var event = $.Event('commit');
    event.controller = controller;
    return event;
  }

  function handlePropertyChange(controller, event) {
    if(event.property === "name") {
      // update view based on model change.
      $('input', controller.$editableView).val(controller.model.name);
      $('span.grocery-item-label', controller.$uneditableView).text(event.newValue);
    }
    else if(event.property === "marked") {
      // update view based on model change.
      $('span.grocery-item-label', controller.$uneditableView)
          .css('text-decoration', ( event.newValue ) ? 'line-through' : 'none');
    }
  }

  function handleStateChange(controller, event) {
    // remove state-based item.
    if( typeof event.oldState !== 'undefined') {
      if(event.oldState === stateEnum.UNEDITABLE) {
        controller.$uneditableView.detach();
      }
      else if(event.oldState === stateEnum.EDITABLE) {
        controller.$editableView.detach();
      }
    }
    // append state-based item.
    if(event.newState === stateEnum.UNEDITABLE) {
      controller.parentView.append(controller.$uneditableView);
    }
    else if(event.newState === stateEnum.EDITABLE) {
      var inputTimeout = setTimeout( function()  {
        clearTimeout(inputTimeout);
        $('input', controller.$editableView).focus();
      }, 100);
      controller.parentView.append(controller.$editableView);
    }
  }

  var stateEnum = {
        UNEDITABLE: 0,
        EDITABLE: 1
      },
      uneditableItemFragment  = '<p class="grocery-item">' +
                                  '<span class="grocery-item-label" />' +
                                  '<button class="delete-item-button">delete</button>' + 
                                '</p>',
      editableItemFragment    = '<p class="editable-grocery-item">' +
                                  '<input name="editableItem" ' +
                                    'class="editable-item" placeholder="Enter item name...">' + 
                                  '</input>' +
                                '</p>',
      listItemController = {
        $editableView: undefined,
        $uneditableView: undefined,
        init: function() {
          var $uneditableLabel;

          this.$editableView = $(editableItemFragment);
          this.$uneditableView = $(uneditableItemFragment);
          $uneditableLabel = $('span.grocery-item-label',  this.$uneditableView);

          // view handlers.
          $uneditableLabel.on('click', (function(controller) {
            return function(event) {
              var toggled = $(this).css('text-decoration') === 'line-through';
              controller.model.marked = !toggled;
            };
          }(this)));
          $('button.delete-item-button', this.$uneditableView).on('click', (function(controller) {
            return function(event) {
              $(controller).trigger(createRemoveEvent(controller));
            };
          }(this)));
          $('input', this.$editableView).on('blur', (function(controller) {
            return function(event) {
              controller.model.name = $(this).val();
              controller.state = stateEnum.UNEDITABLE;
            };
          }(this)));
          // state & model handlers.
          $(this).on('state-change',  (function(controller) {
            return function(event) {
              handleStateChange.call(null, controller, event);
            };
          }(this)));
          $(this.model).on('property-change', (function(controller) {
            return function(event) {
              handlePropertyChange.call(null, controller, event);
              controller.save();
            };
          }(this)));
          // default to undeditable state.
          this.state = stateEnum.UNEDITABLE;
          $uneditableLabel.text(this.model.name);
          $uneditableLabel.css('text-decoration', (this.model.marked) ? 'line-through' : '');
          return this;
        },
        save: function() {
          $(this).trigger(createSaveEvent(this));
        },
        dispose: function() {
          this.$uneditableView.off('click');
          $('input', this.$editableView).off('blur');
          $('span.grocery-item-label',  this.$uneditableView).off('click');
          $('button.delete-item-button', this.$uneditableView).off('click');
          $(this).off('state-change');
          $(this.model).off('property-change');
        }
      };

  return {
    state: stateEnum,
    create: function(node, model) {
      var itemController = Object.create(listItemController);

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

      return itemController.init();
    }
  };

});