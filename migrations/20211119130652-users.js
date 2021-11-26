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
  return db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    firstname: {
      type: 'string',
      length: 150
    },
    lastname: {
      type: 'string',
      length: 150
    },
    email: {
      type: 'string',
      length: 320,
      notNull: true
    },
    type: {
      type: 'string',
      length: 60,
      notNull: true
    },
    username: {
      type: 'string',
      length: 320
    },
    password: {
      type: 'string',
      length: 64
    },
    federated_login: {
      type: 'boolean'
    },
    billing_address: {
      type: 'string',
      length: 500
    },
    shipping_address: {
      type: 'string',
      length: 500
    },
    active: {
      type: 'boolean'
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
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
