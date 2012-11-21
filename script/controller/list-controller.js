define(['jquery', 'script/model/grocery-ls-item'], function($, itemModel) {

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
          var $list = findItemList();
              $itemFragment = $(itemFragment);
          
          $item.remove();
          if( this.editableItem.name.length > 0 ) {
            $itemFragment.append('p').text(this.editableItem.name);
            $itemFragment.data('gls-item', this.editableItem);
            $list.append($itemFragment);
            this.itemList.push(this.editableItem);
          }
          this.editableItem = undefined;
        }
      };

  return listController;
  
});