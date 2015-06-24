'use strict';

const assert = require('assert');
const co     = require('co');
const debug  = require('debug')
const trace  = debug('oren-query:model:trace');
const error  = debug('oren-query:model:error');

class Model {
  constructor(name, base, definition) {
    this._name       = name;
    this._definition = definition;
  }

  // Checks the database and see if the class exists. If yes, it checks the 
  // schema
  provision() {
    return null;
  }

  // Adds a new validation algorithm for a specific key
  validate(key, algo) {
    return null;
  }

  // Overrides save(), refetch(), update(), delete() and make() with a custom
  // method. Context (this) is preserved in all cases.
  override(method, with) {
    return null;
  }

  // Retrieves a DAO based on RID
  read(rid) {
    let query = this._query;

    

    return null;
  }

  // Returns a list of DAOs
  find() {
    return null;
  }

  // Creates an empty DAO, surpressing validation while doing so
  make() {
    return null;
  }

  update() {
    return null;
  }

  delete() {
    return null;
  }
}

class EdgeModel extends Model {
  constructor(name, base, definition) {
    super(name, 'EDGE', definition);
  }


}

class VertexModel extends Model {
  constructor(name, base, definition) {
    super(name, 'VERTEX', definition);
  }
}

class ModelFactory {
  constructor(config) {
    assert(config);
    assert(config.db);
    assert(config.query);

    this._db    = config.db;
    this._query = config.query;
  }

  static Edge(name, definition) {
    return new EdgeModel(name, 'EDGE', definition);
  }

  static Vertex(name, definition) {
    return new VetexModel(name, 'VERTEX', definition);
  }

  static Document(name, definition) {
    return new DocumentModel(name, 'DOCUMENT', definition);
  }

  static General(name, base) {
    return new Model(name, base, definition);
  }
}

module.exports = ModelFactory;