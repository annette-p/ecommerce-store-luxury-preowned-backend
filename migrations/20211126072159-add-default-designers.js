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

  const designers = [
    'Alexander McQueen',
    'Alexander Wang',
    'Balenciaga',
    'Celine',
    'Chanel',
    'Christian Dior',
    'Christian Louboutin',
    'Fendi',
    'Gucci',
    'Hermes',
    'Miu Miu',
    'Patek Philippe',
    'Prada',
    'Rolex',
    'Siant Laurent',
    'Versace',
    'Valentino',
  ]

  designers.forEach( designer => {
    promises.push(
      db.insert(
        'designers', 
        ['name', 'created_at', 'updated_at'],
        [designer, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
      )
    );
  })

  return Promise.all(promises);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
