const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName: 'products'
});

const User = bookshelf.model('User', {
    tableName: 'users'
});

module.exports = {
    Product,
    User
};