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
    carts() {
        return this.belongsToMany("Cart");
    },
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
        return this.belongsToMany("Tag");
    }

});

const Cart = bookshelf.model("Cart", {
    tableName: "carts",
    user() {
        return this.belongsTo("User");
    },
    products() {
        return this.belongsToMany("Product").withPivot(['quantity']);
    }
});

const Tag = bookshelf.model("Tag", {
    tableName: "tags",
    products() {
        return this.belongsToMany("Product");
    }
});

const User = bookshelf.model("User", {
    tableName: "users",
    hidden: ["password"]
});

module.exports = {
    BlacklistedToken,
    Cart,
    Category,
    Designer,
    Insurance,
    Product,
    Tag,
    User
};