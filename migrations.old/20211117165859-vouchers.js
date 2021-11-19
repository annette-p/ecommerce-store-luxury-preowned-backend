'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('vouchers', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    name: {
      type: 'string',
      length: 60,
      notNull: true
    },
    code: {
      type: 'string',
      length: 90,
      notNull: true
    },
    value: {
      type: 'int',
      notNull: true
    },
    quantity: {
      type: 'int',
      notNull: true
    },
    validity: {
      type: 'date'
    }
  });
};

exports.down = function(db) {
  return db.dropTable('vouchers');
};

exports._meta = {
  "version": 1
};
