const bookshelf = require("../bookshelf");

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
    }
});

const User = bookshelf.model("User", {
    tableName: "users"
});

module.exports = {
    Category,
    Designer,
    Insurance,
    Product,
    User
};