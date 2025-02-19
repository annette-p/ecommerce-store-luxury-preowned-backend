'use strict';

var dbm;
var type;
var seed;

const {
  getHashedPassword
} = require('../middlewares/authentication')

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
  // ref: https://stackoverflow.com/a/66194155
  const promises = [];

  promises.push(
    db.insert(
      'users',
      [
        'type', 'email', 'firstname', 'lastname', 
        'username', 'password', 'federated_login', 'active', 
        'created_at', 'updated_at'
      ],
      [
        'Admin', 'admin@your-company.com', 'Admin', 'Admin', 
        'admin', getHashedPassword('password'), false, true, 
        new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    )
  );

  return Promise.all(promises);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
