'use strict';

/*
  db.vertex.account.delete({
      id: 1
    })
    .limit(10)
    .skip(10)
    .orderBy('id')
    .go()
*/
const assert = require('assert');

const Base = require('./base');

module.exports = class Delete extends Base {
  constructor(name, db, where) {
    assert(name && db && where, 'all parameters are required');

    super(name);
    this._db = db;
    this.args._where = this.validator(where);
  }
}
