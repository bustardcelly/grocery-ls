define(['jquery', 'script/service/storage-service', 'script/model/grocery-ls-item'], 
        function($, store, modelFactory) {
  
  describe('Grocery List storage-service', function() {

    describe('getItems()', function() {

      var items,
          itemOne = modelFactory.create(), 
          itemTwo = modelFactory.create(),
          async = new AsyncSpec(this);

      async.beforeEach( function(done) {
        store.saveItem(itemOne);
        store.saveItem(itemTwo);
        store.getItems().then(function(value) {
          items = value;
          done();
        });
      });

      async.afterEach( function(done) {
        store.getItems().then(function(items) {
          items.length = 0;
          done();
        });
      });

      it('should return of type array', function() {
        expect(Array.isArray(items)).toEqual(true);
        expect(items.length).toEqual(2);
      });

      it('should return array of grocery-ls-item types', function() {
        expect(items[0]).toBe(itemOne);
        expect(items[1]).toBe(itemTwo);
      });

    });

    describe('saveItem()', function() {

      var itemOne = modelFactory.create(),
          itemTwo = modelFactory.create(),
          async = new AsyncSpec(this);

      beforeEach( function() {
        store.saveItem(itemOne);
      });

      async.afterEach( function(done) {
        store.getItems().then(function(items) {
          items.length = 0;
          done();
        });
      });

      async.it('should be grow the length of items', function(done) {
        store.getItems().then( function(items) {
          expect(items.length).toEqual(1);
          done();
        });
      });

      async.it('should not grow the length of items on pre-existing item', function(done) {
        itemOne.name = 'oranges';
        store.saveItem(itemOne).then( function(item) {
          store.getItems().then( function(items) {
            expect(items.length).toEqual(1);
            done();
          });
        });
      });

    });

    describe('saveItem() multiples', function() {

      var itemOne = modelFactory.create(),
          itemTwo = modelFactory.create(),
          async = new AsyncSpec(this);

      beforeEach( function() {
        store.saveItem(itemOne);
        store.saveItem(itemTwo);
      });

      afterEach( function() {
        store.empty();
      });

      async.it('should append new items to the end of the list', function(done) {
        store.getItems().then( function(items) {
          expect(items[items.length-1]).toBe(itemTwo);
          done();
        });
      });

      async.it('should update existing item at position', function(done) {
        itemOne.name = 'oranges';
        store.saveItem(itemOne).then( function(item) {
          store.getItems().then( function(items) {
            expect(items.indexOf(itemOne)).toEqual(0);
            done();
          });
        });
      });

    });

    describe('empty()', function() {

      var itemOne = modelFactory.create(),
          itemTwo = modelFactory.create(),
          async = new AsyncSpec(this);

      beforeEach( function() {
        store.saveItem(itemOne);
        store.saveItem(itemTwo);
      });

      afterEach( function() {
        store.empty();
      });

      async.it('should be appended to the list of items', function(done) {
        store.empty().then( function(items) {
          expect(items.length).toEqual(0);
          done();
        });
      });

    });

    describe('removeItem()', function() {

      var itemOne = modelFactory.create(),
          itemTwo = modelFactory.create(),
          async = new AsyncSpec(this);

      beforeEach( function() {
        itemOne.name = 'one';
        store.saveItem(itemOne);
        store.saveItem(itemTwo);
      });

      afterEach( function() {
        store.empty();
      });

      async.it('should shorten length of the list', function(done) {
        store.removeItem(itemOne).then( function(item) {
          store.getItems().then( function(items) {
            expect(items.length).toEqual(1);
            done();
          });
        });
      });

      async.it('should remove item specified from the list', function(done) {
        store.removeItem(itemOne).then( function(item) {
          store.getItems().then( function(items) {
            expect(items.indexOf(itemOne)).toEqual(-1);
            done();
          });
        });
      });

      async.it('should return the item removed if found', function(done) {
        store.removeItem(itemOne).then( function(item) {
          expect(item).toEqual(itemOne);
          done();
        });
      });

      async.it('should return undefined if item not found', function(done) {
        store.removeItem(modelFactory.create()).then( function(item) {
          expect(item).toBeUndefined();
          done();
        });
      });

    });

  });

});