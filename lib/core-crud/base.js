'use strict';

const assert = require('assert');

const isNumber = require('../utils').isNumber;

// all query base needed function
module.exports = class Base {
  constructor(name) {
    assert(name, 'class name is required for orientdb');

    this.args  = {};
    this._name = name;
  }

  parse(props) {
    return props;
  }

  validator(props) {
    return props;
  }

  get db() {
    return this._db;
  }

  go() {
    return this._compile();
  }

  limit(v) {
    // use oren to check for integer
    assert(isNumber(v), 'value needs to be a Number');

    this.args._limit = v;
    return this;
  }

  skip(v) {
    // use oren to check for integer
    assert(isNumber(v), 'value needs to be a Number');

    this.args._skip = v;
    return this;
  }

  orderBy(v) {
    this.args._orderBy = v;
    return this;
  }

  // space separated fields
  select(v) {
    this.args._select = v;
    return this;
  }

  where(v) {
    this.args._where = this.validator(v);
    return this;
  }

  _compile() {
    throw new Error('_compile needs to be override');
  }
}
