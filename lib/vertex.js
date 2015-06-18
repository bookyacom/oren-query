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
      .transform(transform.bind(this))
      .all();
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
      .delete(TYPE)
      .where(this.args._where)
      .scalar();
  }
}

class Update extends CoreCrud.Update {
  _compile() {
    let set = this.validator(this.args._set);

    let q = this.db
      .update(this._name)
      .where(this.args._where)
      .set(set);

    if (this.args._increment) {
      let increment = this.validator(this.args._increment);

      for (let key in increment) {
        q.increment(key, increment[key]);
      }
    }

    if (this.args._add) {
      let add = this.validator(this.args._add);

      for (let key in add) {
        q.add(key, add[key]);
      }
    }

    if (this.args._put) {
      let put = this.validator(this.args._put);

      for (let key in put) {
        q.put(key, put[key]);
      }
    }

    if (this.args._remove) {
      let remove = this.validator(this.args._remove);

      for (let key in remove) {
        q.remove(key, remove[key]);
      }
    }

    return q.one();
  }
}

module.exports = {
  Read  : Read,
  Create: Create,
  Delete: Delete,
  Update: Update
};
