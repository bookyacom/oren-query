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

  _compile() {
    if (this.args.includes || this.args.out || this.args.in) {
      let extra = {};
      let start = this.args._select || '*';

      function populate(args, wrapper) {
        for (let key in args) {
          let value  = null, property = key;
          let params = args[key] ? args[key].join(`','`) : args[key];

          if (wrapper) {
            property = `${wrapper}('${key}')`;
          }

          if (params) {
            value = `${property}.include('${params}')`
          } else {
            value = property;
          }

          start = `${start}, ${value} as ${key}`;
          extra[key] = null;
        }
      }

      if (this.args.includes) {
        populate(this.args.includes);
      }

      if (this.args.out) {
        populate(this.args.out, 'out');
      }

      if (this.args.in) {
        populate(this.args.in, 'in');
      }

      this.args._select = start;
      this.extra        = extra;
    }

    return this.db
      .select(this.args._select)
      .from(this._name)
      .limit(this.args._limit)
      .skip(this.args._skip)
      .order(this.args._orderBy)
      .where(this.args._where)
      .transform(this.transform.bind(this))
      .all();
  }
};

module.exports = Read;
