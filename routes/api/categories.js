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

router.get('/:category_id', async (req, res) => {
    // fetch a category by primary key "id"
    const categoryId = req.params.category_id
    await Category.where({
        'id': categoryId
    }).fetch({
        require: true
    }).then(category => {
        res.status(200).send(category.toJSON()); // convert collection to JSON
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve category due to unexpected error.`
        })
        return;
    });
})

router.put('/:category_id/update', async (req, res) => {
    const category = await Category.where({
        'id': req.params.category_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Category ID ${req.params.category_id}. Category update failed. `
        })
        return;
    });

    if (category !== undefined) {

        category.set('name', req.body.name);

        await category.save().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Category ID ${req.params.category_id} updated successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to update Category ID ${req.params.category_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:category_id/delete', async (req, res) => {
    const category = await Category.where({
        'id': req.params.category_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Category ID ${req.params.category_id}. Category deletion failed. `
        })
        return;
    });

    if (category !== undefined) {
        await category.destroy().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Category ID ${req.params.category_id} deleted successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to delete Category ID ${req.params.category_id} due to unexpected error.`
            })
        });
    }

})

router.post('/create', async (req, res) => {
    const category = new Category();
    category.set('name', req.body.name);
    await category.save().then(() => {
        res.status(201).send({
            "success": true,
            "message": "New category created successfully",
            "category_id": category.get("id")
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new category due to unexpected error.`
        })
    });;
})

module.exports = router;