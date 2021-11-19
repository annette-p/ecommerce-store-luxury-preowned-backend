const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName: 'products'
});

module.exports = { Product };