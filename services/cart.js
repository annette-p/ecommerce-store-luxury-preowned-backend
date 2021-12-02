const cartDataLayer = require("../dal/carts");

async function assignCartOwner(cartId, userId) {
    let userCart = await cartDataLayer.getCartByUser(userId)
    if (userCart && userCart.get("id") !== parseInt(cartId)) {
        throw new Error("User already have an existing cart");
    }
    
    let cart = await getCartById(cartId);
    if (cart && cart.get("user_id") !== null && cart.get("user_id") !== parseInt(userId)) {
        throw new Error(`Cart id ${cartId} is already owned by another user`)
    } else {
        await cartDataLayer.assignCartOwner(cartId, userId);
    }
    
}

// Retrieve the cart for a user 
async function getShoppingCart(userId) {
    return await cartDataLayer.getCartByUser(userId);
}

// Retrieve all shopping carts
async function getAllShoppingCarts() {
    try {
        let carts = await cartDataLayer.getAllCartsWithUserInfo()
        return carts;
    } catch (err) {
        throw err
    }
}

// Retrieve a specific cart by id (handle carts belonging to anonymous users)
async function getCartById(cartId) {
    try {
        let cart = await cartDataLayer.getCartById(cartId)
        // TO DO: validate whether cart belongs to a registered user, and does 
        // the request comes from the same registered user
        return cart;
    } catch (err) {
        throw err
    }
}

// Create cart for a user
async function createCart(userId, cartData) {

    if (userId) {
        let cart = await cartDataLayer.getCartByUser(userId)
        if (cart) {
            return await cartDataLayer.updateCart(cart, cartData)
        } else {
            return await cartDataLayer.createCart(userId, cartData);
        }
    } else {
        return await cartDataLayer.createCart(userId, cartData);
    }

}

// Update cart details
async function updateCart(cartId, cartData) {
    let cart = await cartDataLayer.getCartById(cartId)
    return await cartDataLayer.updateCart(cart, cartData)
}

// Update quantity of a specific item in the cart
async function updateQuantityOfCartItem(cartId, productId, newQuantity) {
    try {
        if (newQuantity > 0) {
            await cartDataLayer.updateCartItemQuantity(cartId, productId, newQuantity);
        } else if (newQuantity === 0) {
            await cartDataLayer.removeItemFromCart(cartId, productId);
        } else {
            throw new Error("Cart item quantity should a non-negative numeric value");
        }
    } catch(err) {
        throw err
    }
}

module.exports = {
    assignCartOwner,
    createCart,
    getAllShoppingCarts,
    getCartById,
    getShoppingCart,
    updateCart,
    updateQuantityOfCartItem
}