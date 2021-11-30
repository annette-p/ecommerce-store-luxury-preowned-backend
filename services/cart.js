const cartDataLayer = require("../dal/carts");

async function getShoppingCart(userId) {
    return await cartDataLayer.getCartByUser(userId);
}

async function updateQuantityInCart(userId, productId, newQuantity) {
    if (newQuantity > 0) {
        await cartDataLayer.updateCartItemQuantity(userId, productId, newQuantity);
        return true;
    } else if (newQuantity === 0) {
        await removeFromCart(userId, productId);
        return true;
    } else {
        return false;
    }
}

async function removeFromCart(userId, productId) {
    await cartDataLayer.removeItemFromCart(userId, productId)
    .then( () => {
        return true;
    })
    .catch( err => {
        return false;
    })
}

module.exports = {
    getShoppingCart,
    updateQuantityInCart
}