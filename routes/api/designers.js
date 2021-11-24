const express = require("express");
const router = express.Router();

const productDataLayer = require("../../dal/products");
const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')

// import the Designer model
const {
    Designer
} = require('../../models');

router.get('/', async (req, res) => {
    await productDataLayer.getAllDesigners().then( designers => {
        res.status(200).send({
            "success": true,
            "data": designers
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve designers due to unexpected error.`
        })
        return;
    });
})

router.get('/:designer_id', async (req, res) => {
    await productDataLayer.getDesignerById(req.params.designer_id).then( designer => {
        if (designer) {
            res.send({
                "success": true,
                "data": designer
            });
        } else {
            res.status(404).send({
                "success": false,
                "message": `Designer id ${req.params.designer_id} does not exists.`
            });
        }
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve designer id ${req.params.designer_id} due to unexpected error.`
        })
        return;
    });
})

router.put('/:designer_id/update', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const designer = await Designer.where({
        'id': req.params.designer_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Designer ID ${req.params.designer_id}. Designer update failed. `
        })
        return;
    });

    if (designer !== undefined) {

        designer.set('name', req.body.name);

        await designer.save().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Designer ID ${req.params.designer_id} updated successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to update Designer ID ${req.params.designer_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:designer_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const designer = await Designer.where({
        'id': req.params.designer_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Designer ID ${req.params.designer_id}. Designer deletion failed. `
        })
        return;
    });

    if (designer !== undefined) {
        await designer.destroy().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Designer ID ${req.params.designer_id} deleted successfully`
            })
        }).catch(_err => {
            res.status(500).send({
                "success": false,
                "message": `Unable to delete Designer ID ${req.params.designer_id} due to unexpected error.`
            })
        });
    }

})

router.post('/create', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const designer = new Designer();
    designer.set('name', req.body.name);
    await designer.save().then(() => {
        res.status(201).send({
            "success": true,
            "message": "New designer created successfully",
            "designer_id": designer.get("id")
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new designer due to unexpected error.`
        })
    });;
})

module.exports = router;