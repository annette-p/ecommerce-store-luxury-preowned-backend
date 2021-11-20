const express = require("express");
const router = express.Router();

// import the Category model
const {
    Category
} = require('../../models');

router.get('/', async (req, res) => {
    // fetch all the categories (i.e., SELECT * FROM categories)

    // let categories = await Category.collection().fetch();
    // res.send(users.toJSON()); // convert collection to JSON

    await Category.collection().fetch().then(categories => {
        res.status(200).send(categories.toJSON());
    }).catch(err => {
        console.error("[Exception -> Categories GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve categories due to unexpected error.`
        })
        return;
    });
})

module.exports = router;