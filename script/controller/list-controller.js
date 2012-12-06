define(['jquery', 'script/model/grocery-ls-item'], function($, itemModel) {


  function findItemByID( itemID, items ) {
    var index = items.length,
        item;
    while( --index > -1 ) {
      item = items[index];
      if( item.id === itemID ) {
        return item;
      }
    }
    return undefined;
  }

  function findRendererByItem( item, renderers ) {
    var index = renderers.length,
        renderer;
    while( --index > -1 ) {
      renderer = renderers[index];
      if( $(renderer).data('gls-item') === item ) {
        return renderer;
      }
    }
    return undefined;
  }

  var $view,
      $item,
      $itemList,
      itemFragment          = '<li class="grocery-item" />',
      editableItemFragment  = '<li class="editable-grocery-item">' +
                                '<input id="editableItem" name="editableItem" ' +
                                  'class="editable-item" placeholder="Enter item name...">' + 
                                '</input>' +
                              '</li>',
      findItemList = function() {
        if( typeof $itemList === 'undefined' ) {
          $itemList = $('.grocery-list', $view);
        }
        return $itemList;
      },
      listController = {
        itemList: [],
        editableItem: undefined,
        setView: function(value) {
          var controller = this;
          $view = $(value);
          $('#add-item-button', this.$view).on( 'click', function(event) {
            controller.createNewItem();
          });
        },
        createNewItem: function() {
          var $list = findItemList(),
              $input,
              controller = this;

          this.editableItem = itemModel.create();
          $item = $(editableItemFragment);
          $input = $('input', $item);
          $input.first().bind( 'blur', function(event) {
            var $this = $(this);

            $this.unbind('blur');
            controller.editFocusedItem( $this.val() );
            controller.saveFocusedItem();
          });

          $item.data('gls-item', this.editableItem);
          $list.append($item);
          $input.first().focus();
        },
        editFocusedItem: function(name) {
          this.editableItem.name = name;
        },
        saveFocusedItem: function() {
          var $list = findItemList(),
              $itemFragment = $(itemFragment);
          
          $item.remove();
          if( this.editableItem.name.length > 0 ) {
            $itemFragment.append('p').text(this.editableItem.name);
            $itemFragment.data('gls-item', this.editableItem);
            $list.append($itemFragment);
            $itemFragment.on('click', (function(controller, model) {
              return function(event) {
                if( model.marked ) {
                  controller.unmarkOffItem(model.id);
                }
                else {
                  controller.markOffItem(model.id);
                }
              };
            }(this, this.editableItem)));
            this.itemList.push(this.editableItem);
          }
          this.editableItem = undefined;
        },
        markOffItem: function(itemID) {
          var item = findItemByID(itemID, this.itemList),
              renderer = findRendererByItem(item, $itemList.children());
          item.marked = true;
          $(renderer).css('text-decoration', 'line-through');
        },
        unmarkOffItem: function(itemID) {
          var item = findItemByID(itemID, this.itemList),
              renderer = findRendererByItem(item, $itemList.children());
          item.marked = false;
          $(renderer).css('text-decoration', 'none');
        }
      };

  return listController;
  
});