'use strict';

const oriento = require('oriento');
const co      = require('co');
const assert  = require('assert');

describe('#Query', function() {
  let db, orenQuery;

  before(function(done) {
    orenQuery  = require('../');

    let server = oriento({
      host: 'localhost'
    });

    db = server.use({
      name: 'test',
      username: 'admin',
      password: 'admin'
    });

    // create some classes
    co(function *() {
      let testClass = yield db.class.create('Test', 'V');

      yield testClass.create({
        name: 'test'
      });
    }).then(function() {
      done();
    }).catch(done);
  });

  after(function(done) {
    co(function *() {
      yield db.delete('VERTEX').scalar();
      yield db.class.drop('Test');
    }).then(function() {
      done();
    }).catch(done);
  });

  describe('#Vertex', function() {
    let vertex, read;

    before(function() {
      vertex = orenQuery.vertex;
    });


    it('should have read, update, delete and create defined', function() {
      assert(vertex.Read, 'no Read class');
      assert(vertex.Delete, 'no Delete class');
      assert(vertex.Update, 'no Update class');
      assert(vertex.Create, 'no Create class');
    });

    it('should throws if parameters are not available', function() {
      assert.throws(function(){
        return new vertex.Read();
      }, /all parameters are required/g);

      assert.throws(function(){
        return new vertex.Update();
      }, /all parameters are required/g);

      assert.throws(function(){
        return new vertex.Delete();
      }, /all parameters are required/g);

      assert.throws(function(){
        return new vertex.Create();
      }, /all parameters are required/g);
    });

    describe('#Error handling', function() {
      beforeEach(function() {
        read = new vertex.Read('Test', db, {
          name : 'test'
        });
      });

      it('should throw error type error', function() {
        assert.throws(function() {
          return read.limit('red');
        }, /value needs to be a Number/g)

        assert.throws(function() {
          return read.skip('red');
        }, /value needs to be a Number/g);
      });
    });

    describe('#Queries', function() {
      describe('#Read', function() {
        beforeEach(function() {
          read = new vertex.Read('Test', db, {
            name : 'test'
          });
        });

        it('should be able to return records', function(done) {
          // exec query
          read
            .go()
            .then(function(records) {
              assert(Array.isArray(records), 'records are not returning as an array');
            })
            .finally(done);
        });

        it('should be able to return a single query', function(done) {
          read.limit(1).go().then(function(records) {
            assert(records.length === 1, 'limit is not working');
            done();
          });
        });

        it('should be able to offset', function(done) {
          read.skip(1).go().then(function(records) {
            assert(records.length === 0, 'offset is not working');
            done();
          });
        });
      });

      describe('#Update', function() {
        let update, mockName = 'test2';

        beforeEach(function() {
          update = new vertex.Update('Test', db, {
            name: 'test'
          });
        });

        afterEach(function(done) {
          co(function *() {
            let update = new vertex.Update('Test', db, {
              name: mockName
            });

            yield update.set({ name: 'test' }).go();
          }).then(function() {
            done();
          });
        });

        it('should be able to update', function(done) {
          update.set({
            name: mockName
          }).go().then(function(count) {
            assert(count > 0, 'unable to update');
            done();
          });
        });

        it('should be able to insert new property', function(done) {
          co(function *() {
            let count = yield update.add({ status: 1 }).go();

            let records = yield new vertex.Read('Test', db, {
              name : 'test'
            }).go();

            let record = records.shift();
            assert(count > 0, 'unable to insert new property');
            assert(record && record.status.length === 1, 'unable to insert to array in vertex');
          }).then(function() {
            done();
          }).catch(done);
        });

        it('should be able to map', function(done) {
          co(function *() {
            let count  = yield update.put({ features: { test: 'test' } }).go();
            let count2 = yield update.put({ features: { test: 'test2' } }).go();

            let records = yield new vertex.Read('Test', db, {
              name : 'test'
            }).go();

            let record = records.shift();

            assert(count > 0, 'unable to insert new property');
            assert(record && record.features && record.features.test === 'test2', 'unable to insert to array in vertex');
          }).then(function() {
            done();
          }).catch(done);
        });

        it('should be able to remove from object', function(done) {
          co(function *() {
            yield update.put({ features: { test: 'test' } }).go();

            let update2 = new vertex.Update('Test', db, {
              name: 'test'
            });

            let count = yield update2.remove({
              features: 'test'
            }).go();

            let records = yield new vertex.Read('Test', db, {
              name : 'test'
            }).go();

            let record = records.shift();

            assert(record && record.features && !record.features.test, 'unable to insert to array in vertex');
          }).then(function() {
            done();
          }).catch(done);
        });

        it('should be able to remove from collection', function(done) {
          co(function *() {
            yield update.add({ status: [2,3] }).go();

            let update2 = new vertex.Update('Test', db, {
              name: 'test'
            });

            let count = yield update2.remove({
              status: 2
            }).go();

            let records = yield new vertex.Read('Test', db, {
              name : 'test'
            }).go();

            let record = records.shift();

            assert(record && record.features && ~record.status.indexOf(2) === 0, 'unable to insert to array in vertex');
          }).then(function() {
            done();
          }).catch(done);
        });
      });
    });
  });
});
