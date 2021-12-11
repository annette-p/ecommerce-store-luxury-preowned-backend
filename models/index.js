const bookshelf = require("../bookshelf");

const BlacklistedToken = bookshelf.model('BlacklistedToken',{
    tableName: 'blacklisted_tokens'
})

const Cart = bookshelf.model("Cart", {
    tableName: "carts",
    user() {
        return this.belongsTo("User");
    },
    products() {
        return this.belongsToMany("Product").withPivot(['quantity']);
    }
});

const Category = bookshelf.model("Category", {
    tableName: "categories",
    products() {
        return this.hasMany("Product");
    }
});

const Consignment = bookshelf.model("Consignment", {
    tableName: "consignments",
    user() {
        return this.belongsTo("User");
    },
    product() {
        return this.belongsTo("Product")
    }
})

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

const Order = bookshelf.model("Order", {
    tableName: "orders",
    user() {
        return this.belongsTo("User");
    },
    orderShipment() {
        return this.hasMany("OrderShipment");
    },
    products() {
        return this.belongsToMany("Product").withPivot(['quantity', 'unit_price']);
    }
});

const OrderShipment = bookshelf.model("OrderShipment", {
    tableName: "order_shipments",
    order() {
        return this.belongsTo("Order");
    }
})

const Product = bookshelf.model("Product", {
    tableName: "products",
    carts() {
        return this.belongsToMany("Cart");
    },
    category() {
        return this.belongsTo("Category");
    },
    consignment() {
        return this.hasOne("Consignment");
    },
    designer() {
        return this.belongsTo("Designer");
    },
    insurance() {
        return this.belongsTo("Insurance");
    },
    orders() {
        return this.belongsToMany("Order");
    },
    tags() {
        return this.belongsToMany("Tag");
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
    // As a security measure, prevent password from being listed when calling toJSON()
    // ref: https://bookshelfjs.org/api.html#Model-instance-hidden
    hidden: ["password"],
    consignments() {
        return this.hasMany("Consignment");
    },
    orders() {
        return this.hasMany("Order");
    }
});

module.exports = {
    BlacklistedToken,
    Cart,
    Category,
    Consignment,
    Designer,
    Insurance,
    Order,
    OrderShipment,
    Product,
    Tag,
    User
};