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
  return db.createTable('insurances', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    policy_date: {
      type: 'date'
    },
    claim_date: {
      type: 'date'
    },
    coverage_amount: {
      type: 'int',
      unsigned: true
    },
    created_at: {
      type: 'datetime'
    },
    updated_at: {
      type: 'datetime'
    }
  });
};

exports.down = function(db) {
  return db.dropTable('insurances');
};

exports._meta = {
  "version": 1
};
