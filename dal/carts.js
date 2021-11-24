const {
    Cart
} = require("../models");

async function getAllCarts() {
    try {
        let carts = await Cart.collection().fetch({
            withRelated: ["user", "products"]
        });
        return carts;
    } catch(err) {
        throw err
    }
}

module.exports = {
    getAllCarts
}