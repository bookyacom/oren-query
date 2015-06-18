'use strict';

const oriento = require('oriento');
const co      = require('co');
const assert  = require('assert');

describe('#Edge', function() {
  let db, orenQuery,
  edge, parent, child, first, second;

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

    // create some classes and records
    co(function *() {
      let edge   = yield db.class.create('Relation', 'E');
      parent = yield db.class.create('Parent', 'V');
      child  = yield db.class.create('Child', 'V');

      first = yield parent.create({
        name: 'test'
      });

      second = yield child.create({
        name: 'test12'
      });

      yield db.create('EDGE', 'Relation').from(first['@rid']).to(second['@rid']).set({ test: 'test' }).one();
    }).then(function() {
      done();
    }).catch(done);
  });

  before(function() {
    edge = orenQuery.edge;
  });

  after(function(done) {
    co(function *() {
      yield db.delete('VERTEX').scalar();
      yield db.class.drop('Parent');
      yield db.class.drop('Child');
      yield db.class.drop('Relation');
    }).then(function() {
      done();
    }).catch(done);
  });

  it('should have read, update, delete and create defined', function() {
    assert(edge.Read, 'no Read class');
    assert(edge.Delete, 'no Delete class');
    assert(edge.Update, 'no Update class');
    assert(edge.Create, 'no Create class');
  });

  describe('#Queries', function() {
    describe('#Read', function() {
      it('should be able to read from edges', function(done) {
        let read = new edge.Read('Relation', db, {
          test: 'test'
        });

        read.go().then(function(edges) {
          assert(edges.length > 0);
          done();
        })
      });
    });

    describe('#Create', function(done) {
      let record1, record2;

      before(function(done) {
        co(function *() {
          record1 = yield parent.create({
            name: 'test'
          });

          record2 = yield child.create({
            name: 'test12'
          });
        }).then(done, done);
      });

      it('should be able to create new edge', function(done) {
        let create = new edge.Create('Relation', db, {
          from : record1['@rid'],
          to   : record2['@rid']
        });

        create.go().then(function(edge) {
          assert(edge);
          done();
        });
      });
    });

    describe('#Update', function() {
      it('should be able to update its property', function(done) {
        co(function *() {
          let update = new edge.Update('Relation', db, {
            test: 'test'
          });

          let count = yield update.set({
            test: 'test2'
          }).go();

          assert(count > 0);
          done()
        }).catch(done);
      });
    });

    describe('#Delete', function() {
      it('should be able to remove edge', function(done) {
        co(function *() {
          let remove = new edge.Delete('Relation', db, {
            from: first['@rid'],
            to: second['@rid']
          });

          let count = yield remove.go();

          assert(count > 0);
          done();
        }).catch(done);
      });
    });
  });
});
