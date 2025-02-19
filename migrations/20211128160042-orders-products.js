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
  return db.createTable('orders_products', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    order_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_products_order_fk',
        table: 'orders',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    product_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_products_product_fk',
        table: 'products',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    quantity: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    unit_price: {
      type: 'int',
      unsigned: true,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('orders_products');
};

exports._meta = {
  "version": 1
};
