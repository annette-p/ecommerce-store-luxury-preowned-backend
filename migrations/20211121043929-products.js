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
    name: {
      type: 'string',
      length: 256
    },
    retail_price: {
      type: 'int',
      unsigned: true
    },
    selling_price: {
      type: 'int',
      unsigned: true
    },
    description: {
      type: 'string',
      length: 500
    },
    specifications: {
      type: 'string',
      length: 500
    },
    condition: {
      type: 'string',
      length: 80
    },
    condition_description: {
      type: 'string',
      length: 300
    },
    sku: {
      type: 'string',
      length: 60
    },
    quantity: {
      type: 'int',
      unsigned: true,
      notNull: true
    },
    authenticity: {
      type: 'boolean'
    },
    product_image_1: {
      type: 'string',
      length: 500
    },
    product_image_2: {
      type: 'string',
      length: 500
    },
    product_gallery_1: {
      type: 'string',
      length: 500
    },
    product_gallery_2: {
      type: 'string',
      length: 500
    },
    product_gallery_3: {
      type: 'string',
      length: 500
    },
    product_gallery_4: {
      type: 'string',
      length: 500
    },
    product_gallery_5: {
      type: 'string',
      length: 500
    },
    product_gallery_6: {
      type: 'string',
      length: 500
    },
    product_gallery_7: {
      type: 'string',
      length: 500
    },
    product_gallery_8: {
      type: 'string',
      length: 500
    },
    created_at: {
      type: 'datetime'
    },
    updated_at: {
      type: 'datetime'
    },
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
