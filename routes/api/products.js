const express = require("express");
const router = express.Router();

// import the Product model
const {
    Product
} = require('../../models');

router.get('/', async (req, res) => {
    // fetch all the products (ie, SELECT * from products)

    let products = await Product.collection().fetch();
    res.send(products.toJSON()); // convert collection to JSON
})

module.exports = router;
