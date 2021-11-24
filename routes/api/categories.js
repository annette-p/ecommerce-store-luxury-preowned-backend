const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/products");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')

// import the Category model
const {
    Category
} = require('../../models');

// Retrieve all categories
router.get('/', async (req, res) => {
    await productDataLayer.getAllCategories().then( categories => {
        res.status(200).send({
            "success": true,
            "data": categories
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve categories due to unexpected error.`
        })
        return;
    });
})

router.get('/:category_id', async (req, res) => {
    await productDataLayer.getCategoryById(req.params.category_id).then( category => {
        if (category) {
            res.send({
                "success": true,
                "data": category
            });
        } else {
            res.status(404).send({
                "success": false,
                "message": `Category id ${req.params.category_id} does not exists.`
            });
        }
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve category id ${req.params.category_id} due to unexpected error.`
        })
        return;
    });
})

router.put('/:category_id/update', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
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

router.delete('/:category_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
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

router.post('/create', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
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