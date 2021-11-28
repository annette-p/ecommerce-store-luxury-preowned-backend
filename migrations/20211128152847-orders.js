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
  return db.createTable('orders', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'order_user_fk',
        table: 'users',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    payment_reference: {
      type: 'string',
      length: 60,
      notNull: true
    },
    payment_method: {
      type: 'string',
      length: 45
    },
    status: {
      type: 'string',
      length: 60,
      notNull: true
    },
    comment: {
      type: 'string',
      length: 500
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
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
