'use strict';

/*
  db.vertex.account.find({
    name: 'lol'
  }).go();

  db.vertex.account.find({
    name: 'lol'
  })
  .select()
  .limit(10)
  .orderBy('name rid')
  .skip(10)
  .go();
 */

const assert = require('assert');
const Base = require('./base');

class Read extends Base {
  constructor(name, db, where) {
    assert(name && db && where, 'all parameters are required');

    super(name);
    this._db      = db;
    this.args._where = this.validator(where);
  }

  // for linking, linklist instead of edges
  include(key, params) {
    assert(key && typeof(key) === 'string', 'key is required');
    this.args.includes = this.args.includes || {};

    this.args.includes[key] = params || null;

    return this;
  }

  out(key, params) {
    assert(key && typeof(key) === 'string', 'key is required');

    this.args.out = this.args.out || {};

    this.args.out[key] = params || null;

    return this;
  }

  in(key, params) {
    assert(key && typeof(key) === 'string', 'key is required');
    this.args.in = this.args.in || {};

    this.args.in[key] = params || null;

    return this;
  }
};

module.exports = Read;
