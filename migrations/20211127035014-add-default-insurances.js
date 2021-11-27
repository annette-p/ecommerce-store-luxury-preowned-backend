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

  promises.push(db.insert('insurances', {
    company_name: 'AIG',
    policy_name: 'AIG SME Package for Retail & Shop - Package A',
    policy_date: '2021-11-01',
    coverage_amount: 150000,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }));

  promises.push(db.insert('insurances', {
    company_name: 'UOB',
    policy_name: 'UOB BizCare - Plan A',
    policy_date: '2021-11-01',
    coverage_amount: 500000,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }));

  return Promise.all(promises);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
