'use strict';

const CoreCrud = require('./core-crud');
const Vertex   = require('oren-dao').Vertex;

const TYPE     = 'VERTEX';

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

  let vertex    = new Vertex(this.db, id, validated);
  vertex.raw    = record;
  vertex.others = this.extra;

  return vertex;
};

class Read extends CoreCrud.Read {
  get transform() {
    return transform;
  }
}

class Create extends CoreCrud.Create {
  _compile() {
    return this.db
      .create(TYPE, this._name)
      .set(this.args._set)
      .transform(transform.bind(this))
      .one();
  }
}

class Delete extends CoreCrud.Delete {
  _compile() {
    return this.db
      .delete(TYPE, this._name)
      .where(this.args._where)
      .scalar();
  }
}

module.exports = {
  Read  : Read,
  Create: Create,
  Delete: Delete,
  Update: CoreCrud.Update
};
