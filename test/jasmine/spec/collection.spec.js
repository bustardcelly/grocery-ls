define( ['jquery', 'script/collection/collection'], function($, collectionFactory) {
  
  describe('Collection', function() {

    describe('collection factory instance creation', function() {
      
      it('should create unique instances of collection from create()', function() {
        var collectionOne = collectionFactory.create(),
            collectionTwo = collectionFactory.create();
        expect(collectionOne).not.toBe(collectionTwo);
      });

      it('should create an empty collection without source array', function() {
        var collection = collectionFactory.create();
        expect(collection).not.toBeUndefined();
        expect(collection.itemLength()).toBe(0);
      });

      it('should create a collection from source array', function() {
        var itemOne = 'apples',
            itemTwo = 'oranges',
            collection = collectionFactory.create([itemOne, itemTwo]);
        expect(collection.itemLength()).toBe(2);
        expect(collection.getItemAt(0)).toEqual(itemOne);
        expect(collection.getItemAt(1)).toEqual(itemTwo);
      });

    });

    describe('collection item addition', function() {

      var collection,
          async = new AsyncSpec(this);

      beforeEach( function() {
        collection = collectionFactory.create();
      });

      it('should append item to list from addItem()', function() {
        var item = 'grapes';
        collection.addItem(item);
        expect(collection.itemLength()).toBe(1);
        expect(collection.getItemAt(0)).toEqual(item);
      });

      it('should maintain order during multiple additions', function() {
        var itemOne = 'grapes',
            itemTwo = 'grapefruit';
        collection.addItem(itemOne);
        collection.addItem(itemTwo);
        expect(collection.itemLength()).toBe(2);
        expect(collection.getItemAt(1)).toEqual(itemTwo);
      });

      async.it('should notify on addition of item', function(done) {
        var item = 'grapes';
        $(collection).on('collection-change', function(event) {
          expect(event.kind).toBe('add');
          expect(event.items.length).toBe(1);
          expect(event.items[0]).toEqual(item);
          $(collection).off('collection-change');
          done();
        });
        collection.addItem(item);
      });

      afterEach( function() {
        collection = undefined;
      });

    });

    describe('collection item removal', function() {

      var collection,
          itemOne = 'pineapple',
          itemTwo = 'pear',
          async = new AsyncSpec(this);

      beforeEach( function() {
        collection = collectionFactory.create();
        collection.addItem(itemOne);
      });

      it('should remove only specified item and report length of 0 from removeItem()', function() {
        collection.removeItem(itemOne);
        expect(collection.itemLength()).toBe(0);
      });

      it('should remove specified item from proper index', function() {
        collection.addItem(itemTwo);
        collection.removeItem(itemOne);
        expect(collection.itemLength()).toBe(1);
        expect(collection.getItemAt(0)).toEqual(itemTwo);
      });

      it('should retain items in collection if item provided to removeItem() is not found', function() {
        collection.addItem(itemTwo);
        collection.removeItem('watermelon');
        expect(collection.itemLength()).toBe(2);
      });

      it('should empty the list on removeAll()', function() {
        collection.addItem(itemTwo);
        collection.removeAll();
        expect(collection.itemLength()).toBe(0);
      });

      async.it('should notify on removal of item', function(done) {
        collection.addItem(itemTwo);
        $(collection).on('collection-change', function(event) {
          expect(event.kind).toBe('remove');
          expect(event.items.length).toBe(1);
          expect(event.items[0]).toEqual(itemOne);
          $(collection).off('collection-change');
          done();
        });
        collection.removeItem(itemOne);
      });

      async.it('should notify on reset of collection', function(done) {
        $(collection).on('collection-change', function(event) {
          expect(event.kind).toBe('reset');
          expect(event.items.length).toBe(0);
          $(collection).off('collection-change');
          done();
        });
        collection.removeAll();
      });

      afterEach( function() {
        collection = undefined;
      });

    });

  });

});