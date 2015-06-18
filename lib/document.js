'use strict';

const Document = require('oren-dao').Document;
const assert   = require('assert');

const CoreCrud = require('./core-crud');

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

  let doc    = new Document(this.db, id, validated);
  doc.raw    = record;
  doc.others = this.extra;

  return doc;
};

class Read extends CoreCrud.Read {
  get transform() {
    return transform;
  }
}

class Create extends CoreCrud.Create {
  get transform() {
    return transform;
  }
}

module.exports = {
  Read  : Read,
  Create: Create,
  Delete: CoreCrud.Delete,
  Update: CoreCrud.Update
};
