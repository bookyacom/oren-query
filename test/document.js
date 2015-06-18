'use strict';

const oriento = require('oriento');
const co      = require('co');
const assert  = require('assert');

const TABLE_NAME = 'Test';

describe('#Document', function() {
  let db, orenQuery,
    doc;

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
      let testClass = yield db.class.create(TABLE_NAME);

      yield testClass.create({
        name: 'test'
      });
    }).then(function() {
      done();
    }).catch(done);
  });

  before(function() {
    doc = orenQuery.document;
  });

  after(function(done) {
    co(function *() {
      yield db.class.drop('Test');
    }).then(function() {
      done();
    }).catch(done);
  });

  it('should have read, update, delete and create defined', function() {
    assert(doc.Read, 'no Read class');
    assert(doc.Delete, 'no Delete class');
    assert(doc.Update, 'no Update class');
    assert(doc.Create, 'no Create class');
  });

  describe('#Read', function() {
    it('should be able to get documents', function(done) {
      let read = new doc.Read(TABLE_NAME, db, {
        name: 'test'
      });

      read.go().then(function(records) {
        assert(records.length > 0);
        done()
      }).catch(done);
    });
  });

  describe('#Update', function() {
    it('should be able to update', function(done) {
      let update = new doc.Update(TABLE_NAME, db, {
        name: 'test'
      });

      update.set({ name: 'test' }).go().then(function(count) {
        assert(count > 0);
        done()
      }).catch(done);
    });
  });

  describe('#Create', function() {
    it('should be able to create new document', function(done) {
      let create = new doc.Create(TABLE_NAME, db, {
        test: 'test'
      });

      create.go().then(function(record) {
        assert(record);
        assert(record.test);
        done();
      }).catch(done);
    });
  });

  describe('#Delete', function() {
    it('should be able to delete a single document', function(done) {
      let remove = new doc.Delete(TABLE_NAME, db, {
        test: 'test'
      });

      remove.go().then(function(count) {
        assert(count > 0);
        done();
      }).catch(done);
    });
  });
});
