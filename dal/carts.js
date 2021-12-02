const {
    Cart
} = require("../models");

// assign ownership to cart that is owned by an anonymous user
async function assignCartOwner(cartId, userId) {
    await getCartById(cartId)
    .then (async (cart) => {
        if (cart) {
            cart.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
            cart.set('user_id', userId);
            await cart.save();
        }
    }).catch(err => {
        throw err;
    })
}

// Create cart for a user
async function createCart(userId, cartData) {
    const cart = new Cart();

    // cart for an authenticated user
    if (userId) {
        cart.set('user_id', userId);
    }
    
    cart.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
    cart.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

    await cart.save()

    // handle items in cart
    if (cartData.items) {
        await cart.products().attach(cartData.items);
    }

    return cart.get("id")

}

// Retrieve all carts along with the user information.
// This would be exposed to admins
async function getAllCartsWithUserInfo() {
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
            withRelated: ["products"]
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

// update quantity of an item for a user in the cart
async function updateCartItemQuantity(cartId, productId, quantity) {
    await getCartById(cartId)
    .then( async (cart) => {
        if (cart) {
            let existingItemIds = await cart.related("products").pluck("id");
            if (existingItemIds.includes(parseInt(productId))) {
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
            throw new Error(`Cart ID ${cartId} does not exists`)
        }
    })
}

// Update a given cart collection
async function updateCart(cart, newCartData) {
    cart.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

    await cart.save();

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

    return cart.get("id")
}

// Remove a specific item from cart
async function removeItemFromCart(cartId, productId) {
    await getCartById(cartId)
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
    assignCartOwner,
    createCart,
    getAllCartsWithUserInfo,
    getCartById,
    getCartByUser,
    removeItemFromCart,
    updateCart,
    updateCartItemQuantity
}