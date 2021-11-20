const bookshelf = require('../bookshelf')

const Category = bookshelf.model('Category', {
    tableName: 'categories'
});

const Product = bookshelf.model('Product', {
    tableName: 'products'
});

const User = bookshelf.model('User', {
    tableName: 'users'
});

module.exports = {
    Category,
    Product,
    User
};