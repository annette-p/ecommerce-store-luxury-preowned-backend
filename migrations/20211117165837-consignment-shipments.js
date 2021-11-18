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
  return db.createTable('consignment_shipments', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    consignment_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'consignment_shipment_consignment_fk',
        table: 'consignments',
        mapping: 'id',
        rules:{
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    shipment_provider: {
      type: 'string',
      length: 120
    },
    tracking_number: {
      type: 'string',
      length: 30
    },
    shipping_address: {
      type: 'string',
      length: 300
    },
    remarks: {
      type: 'string',
      length: 300
    }
  });
};

exports.down = function(db) {
  return db.dropTable('consignment_shipments');
};

exports._meta = {
  "version": 1
};
