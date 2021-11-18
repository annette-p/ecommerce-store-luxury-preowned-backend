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
  return db.createTable('shopping_carts', {
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
        name: 'shopping_cart_user_fk',
        table: 'users',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    reminder: {
      type: 'boolean'
    },
    reminder_type: {
      type: 'string',
      length: 60
    },
    holding_period: {
      type: 'date'
    }
  });
};

exports.down = function(db) {
  return db.dropTable('shopping_carts');
};

exports._meta = {
  "version": 1
};
