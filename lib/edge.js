'use strict';

const Edge     = require('oren-dao').Edge;
const assert   = require('assert');

const CoreCrud = require('./core-crud');

const TYPE     = 'EDGE';

let transform = function(record) {
  let id        = record['@rid'];
  let validated = this.parse(record);

  if (record && this.extra) {
    for (let key in this.extra) {
      if (record[key]) {
        this.extra[key] = record[key];
      }
    }
  }

  let edge    = new Edge(this.db, id, validated);
  edge.raw    = record;
  edge.others = this.extra;

  return edge;
};

class Read extends CoreCrud.Read {
  get transform() {
    return transform;
  }
}

class Create extends CoreCrud.Create {
  constructor(name, db, properties) {
    assert(properties.to && properties.from, 'to and from properties are required');
    super(name, db, properties);
    this.to   = properties.to;
    this.from = properties.from;

    delete this.args._set.to;
    delete this.args._set.from;
  }

  _compile() {
    return this.db
      .create(TYPE, this._name)
      .from(this.from)
      .to(this.to)
      .set(this.args._set)
      .transform(transform.bind(this))
      .one();
  }
}

class Delete extends CoreCrud.Delete {
  constructor(name, db, properties) {
    super(name, db, properties);
    assert(properties.to && properties.from, 'to and from properties are required');

    this.to   = properties.to;
    this.from = properties.from;
  }

  _compile() {
    return this.db
      .delete(TYPE, this._name)
      .from(this.from)
      .to(this.to)
      .scalar();
  }
}

module.exports = {
  Read  : Read,
  Create: Create,
  Delete: Delete,
  Update: CoreCrud.Update
};
