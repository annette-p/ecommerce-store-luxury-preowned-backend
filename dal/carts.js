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

// Retrieve a specific cart by id (handle carts belonging to anonymous users)
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

// Retrieve a specific cart by user (handle carts belonging to authenticated users)
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

            // cart for an authenticated user
            if (userId) {
                cart.set('user_id', userId);
            }
            
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

// update quantity of an item for a user in the cart
async function updateCartItemQuantity(userId, productId, quantity) {
    await getCartByUser(userId)
    .then( async (cart) => {
        if (cart) {
            let existingItemIds = await cart.related("products").pluck("id");
            if (existingItemIds.includes(productId)) {
                cart.products().updatePivot({
                    "quantity": quantity
                }, {
                    query: function (qb) {
                        qb.where({
                            "product_id": productId
                        })
                    }
                })
            } else {
                cart.products().attach([{ "product_id": productId, "quantity": quantity }])
            }
        } else {
            const newCart = new Cart();

            newCart.set('user_id', userId);
            newCart.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
            newCart.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

            await newCart.save().then(async () => {

                // handle items in cart
                await newCart.products().attach([{ "product_id": productId, "quantity": quantity }]);

                return newCart.get("id");
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

async function removeItemFromCart(userId, productId) {
    await getCartByUser(userId)
    .then(async (cart) => {
        try {
            let itemToRemove = await cart.related("products").where({"product_id": productId}).pluck("id");
            await cart.products().detach(itemToRemove);
        } catch(err) {
            throw err
        }
    })
}

module.exports = {
    createCart,
    deleteCartById,
    deleteCartByuser,
    getAllCarts,
    getCartById,
    getCartByUser,
    removeItemFromCart,
    updateCartById,
    updateCartByUser,
    updateCartItemQuantity
}