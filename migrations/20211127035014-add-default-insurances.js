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
  // ref: https://stackoverflow.com/a/66194155
  const promises = [];

  promises.push(
    db.insert(
      'insurances', 
      [
        'company_name', 'policy_name', 'policy_date', 'coverage_amount', 
        'created_at', 'updated_at'],
      [
        'AIG', 'AIG SME Package for Retail & Shop - Package A', '2021-11-01', 150000, 
        new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    )
  );

  promises.push(
    db.insert(
      'insurances', 
      [
        'company_name', 'policy_name', 'policy_date', 'coverage_amount', 
        'created_at', 'updated_at'],
      [
        'UOB', 'UOB BizCare - Plan A', '2021-11-01', 500000, 
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
