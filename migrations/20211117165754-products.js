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
  return db.createTable('products', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    designer_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_designer_fk',
        table: 'designers',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    category_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_category_fk',
        table: 'categories',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    insurance_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_insurance_fk',
        table: 'insurances',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    price: {
      type: 'int',
      unsigned: true
    },
    details: {
      type: 'string',
      length: 256
    },
    condition: {
      type: 'string',
      length: 256
    },
    image: {
      type: 'string',
      length: 256
    },
    sku: {
      type: 'string',
      length: 60
    }
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
