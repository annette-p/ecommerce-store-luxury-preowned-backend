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
  return db.createTable('consignments', {
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
        name: 'consignment_user_fk',
        table: 'users',
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
        name: 'consignment_product_fk',
        table: 'products',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    create_date: {
      type: 'datetime'
    },
    status: {
      type: 'string',
      length: 60,
      notNull: true
    },
    payout_scheme_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'consignment_payout_scheme_fk',
        table: 'payout_schemes',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
  });
};

exports.down = function(db) {
  return db.dropTable('consignments');
};

exports._meta = {
  "version": 1
};
