const bookshelf = require("../bookshelf");

const BlacklistedToken = bookshelf.model('BlacklistedToken',{
    tableName: 'blacklisted_tokens'
})

const Category = bookshelf.model("Category", {
    tableName: "categories",
    products() {
        return this.hasMany("Product");
    }
});

const Designer = bookshelf.model("Designer", {
    tableName: "designers",
    products() {
        return this.hasMany("Product");
    }
});

const Insurance = bookshelf.model("Insurance", {
    tableName: "insurances",
    products() {
        return this.hasMany("Product");
    }
});

const Product = bookshelf.model("Product", {
    tableName: "products",
    category() {
        return this.belongsTo("Category");
    },
    designer() {
        return this.belongsTo("Designer");
    },
    insurance() {
        return this.belongsTo("Insurance");
    },
    tags() {
        return this.belongsToMany('Tag');
    }
});

const Tag = bookshelf.model("Tag", {
    tableName: "tags",
    products() {
        return this.belongsToMany('Product');
    }
});

const User = bookshelf.model("User", {
    tableName: "users"
});

module.exports = {
    BlacklistedToken,
    Category,
    Designer,
    Insurance,
    Product,
    Tag,
    User
};