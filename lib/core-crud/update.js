'use strict';

/*
  Orientdb
  =========
  UPDATE <class>|cluster:<cluster>|<recordID>
  [SET|INCREMENT|ADD|REMOVE|PUT <field-name> = <field-value>[,]*]|[CONTENT|MERGE <JSON>]
  [UPSERT]
  [RETURN <returning> [<returning-expression>]]
  [WHERE <conditions>]
  [LOCK default|record]
  [LIMIT <max-records>] [TIMEOUT <timeout>]

  db.vertex.account.update({
    id: 1
  })
  .set({
    id: 1
  })
  .
 */

const assert = require('assert');

const Base     = require('./base');
const isObject = require('../utils').isObject;

module.exports = class Update extends Base {
  constructor(name, db, where) {
    assert(name && db && where, 'all parameters are required');

    super(name);

    this._db = db;
    this.args._where = this.validator(where);
  }

  set(v) {
    assert(isObject(v), 'value needs to be a plain object');

    this.args._set = v;
    return this;
  }

  increment(v) {
    assert(isObject(v), 'value needs to be a plain object');

    this.args._increment = v;
    return this;
  }

  add(v) {
    assert(isObject(v), 'value needs to be a plain object');

    this.args._add = v;
    return this;
  }

  put(v) {
    assert(isObject(v), 'value needs to be a plain object');

    this.args._put = v;
    return this;
  }

  remove(v) {
    assert(isObject(v), 'value needs to be a plain object');

    this.args._remove = v;
    return this;
  }

  upsert() {
    this.args._upsert = true;
    return this;
  }
};
