const bookshelf = require('../bookshelf')

const Category = bookshelf.model('Category', {
    tableName: 'categories'
});

const Designer = bookshelf.model('Designer', {
    tableName: 'designers'
});

const Insurance = bookshelf.model('Insurance', {
    tableName: 'insurances'
});

const Product = bookshelf.model('Product', {
    tableName: 'products'
});

const User = bookshelf.model('User', {
    tableName: 'users'
});

module.exports = {
    Category,
    Designer,
    Insurance,
    Product,
    User
};