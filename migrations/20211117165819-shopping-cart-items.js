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
  return db.createTable('shopping_cart_items', {
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
        name: 'shopping_card_item_product_fk',
        table: 'products',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    shopping_cart_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'shopping_card_item_shopping_cart_fk',
        table: 'shopping_carts',
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
  return db.dropTable('shopping_cart_items');
};

exports._meta = {
  "version": 1
};
