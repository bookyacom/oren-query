'use strict';

/*
  OrientDB
  ========
  INSERT INTO [class:]<class>|cluster:<cluster>|index:<index>
  [(<field>[,]*) VALUES (<expression>[,]*)[,]*]|
  [SET <field> = <expression>|<sub-command>[,]*]|
  [CONTENT {<JSON>}]|
  [RETURN <expression>]
  [FROM <query>]

  db.vertex.account.insert({
    id: 122,
    read: true
  }).go();
 */
const assert = require('assert');

const Base = require('./base');

module.exports = class Create extends Base {
  constructor(name, db, properties) {
    assert(name && db && properties, 'all parameters are required');

    super(name);
    this._db = db;
    this.args._set = this.validator(properties);
  }

  _compile() {
    return this.db
      .insert()
      .into(this._name)
      .set(this.args._set)
      .transform(this.transform.bind(this))
      .one();
  }
}
