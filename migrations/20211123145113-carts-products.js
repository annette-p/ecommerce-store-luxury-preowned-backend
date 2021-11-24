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
  return db.createTable('carts_products', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    product_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'carts_products_product_fk',
        table: 'products',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    cart_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'carts_products_cart_fk',
        table: 'carts',
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
    }
  });
};

exports.down = function(db) {
  return db.dropTable('carts_products');
};

exports._meta = {
  "version": 1
};
