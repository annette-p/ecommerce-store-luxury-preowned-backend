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
            withRelated: ["products"]
        });
        return cart;
    } catch (err) {
        throw err
    }
}

// Create cart for a user
async function createCart(userId, cartData) {
    await getCartByUser(userId)
    .then( async (cart) => {
        if (cart) {
            console.log("User has existing cart")
            await updateCart(cart, cartData)
            .then( () => {
                return cart.get("id");
            })
            .catch(err => {
                throw err
            });
        } else {
            // user do not have an existing cart
            console.log("User has no existing cart")
            const cart = new Cart();

            cart.set('user_id', userId);
            cart.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
            cart.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

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
    })
}

// Update a cart by id
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

// Update a cart for a user
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

// Update a given cart collection
async function updateCart(cart, newCartData) {
    cart.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

    cart.set("user_id", cart.get("user_id"));

    await cart.save().then(async () => {

        let selectedItemsId = newCartData.items.map(item => item.product_id);

        let existingItemIds = await cart.related("products").pluck("id");
        let itemsToRemove = existingItemIds.filter(id => selectedItemsId.includes(id) === false);
        await cart.products().detach(itemsToRemove);

        newCartData.items.forEach(async (item) => {

            // use of "updatePivot()"
            // ref: https://stackoverflow.com/a/31124401
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