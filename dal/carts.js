const {
    Cart
} = require("../models");

// Retrieve all carts
async function getAllCarts() {
    try {
        let carts = await Cart.collection().fetch({
            withRelated: ["user", "products"]
        });
        return carts;
    } catch (err) {
        throw err
    }
}

// Retrieve a specific cart by id
async function getCartById(cartId) {
    try {
        let cart = await Cart.where({
            'id': cartId
        }).fetch({
            require: false,
            withRelated: ["user", "products"]
        });
        return cart;
    } catch (err) {
        throw err
    }
}

// Retrieve a specific cart by user
async function getCartByUser(userId) {
    try {
        let cart = await Cart.where({
            'user_id': userId
        }).fetch({
            require: false,
            withRelated: ["user", "products"]
        });
        return cart;
    } catch (err) {
        throw err
    }
}

async function createCart(cartData) {
    const cart = new Cart();

    cart.set('user_id', cartData.user_id);
    cart.set('date_created', new Date());

    await cart.save().then(async () => {

        // handle items in cart
        if (cartData.items) {
            await cart.products().attach(cartData.items);
        }

        return cart.get("id");
    }).catch(err => {
        throw err;
    });
}

async function updateCartById(cartId, newCartData) {
    await getCartById(cartId)
    .then(async (cart) => {
        try {
            await updateCart(cart, newCartData)
        } catch(err) {
            throw err
        }
    })
}

async function updateCartByUser(userId, newCartData) {
    await getCartByUser(userId)
    .then(async (cart) => {
        try {
            await updateCart(cart, newCartData)
        } catch(err) {
            throw err
        }
    })
}

async function updateCart(cart, newCartData) {
    cart.set('date_created', new Date());

    await cart.save().then(async () => {

        let selectedItemsId = newCartData.items.map(item => item.product_id);

        let existingItemIds = await cart.related("products").pluck("id");
        let itemsToRemove = existingItemIds.filter(id => selectedItemsId.includes(id) === false);
        await cart.products().detach(itemsToRemove);

        newCartData.items.forEach(async (item) => {

            if (existingItemIds.includes(item.product_id)) {
                cart.products().updatePivot({
                    "quantity": item.quantity
                }, {
                    query: function (qb) {
                        qb.where({
                            "product_id": item.product_id
                        })
                    }
                })
            } else {
                cart.products().attach(item)
            }

        })
    }).catch(err => {
        throw err;
    });
}

async function deleteCartById(cartId) {
    await getCartById(cartId)
    .then(async (cart) => {
        try {
            await deleteCart(cart)
        } catch(err) {
            throw err
        }
    })
}

async function deleteCartByuser(userId) {
    await getCartByUser(userId)
    .then(async (cart) => {
        try {
            await deleteCart(cart)
        } catch(err) {
            throw err
        }
    })
}

async function deleteCart(cart) {
    try {
        await cart.destroy();
    } catch(err) {
        throw err;
    }
}

module.exports = {
    createCart,
    deleteCartById,
    deleteCartByuser,
    getAllCarts,
    getCartById,
    getCartByUser,
    updateCartById,
    updateCartByUser
}