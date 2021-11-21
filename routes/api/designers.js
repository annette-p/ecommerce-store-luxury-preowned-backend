const express = require("express");
const router = express.Router();

// import the Designer model
const {
    Designer
} = require('../../models');

router.get('/', async (req, res) => {
    // fetch all the designers (i.e., SELECT * FROM designers)

    await Designer.collection().fetch().then(designers => {
        res.status(200).send(designers.toJSON());
    }).catch(err => {
        console.error("[Exception -> Designers GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve designers due to unexpected error.`
        })
        return;
    });
})

router.get('/:designer_id', async (req, res) => {
    // fetch a designer by primary key "id"
    const designerId = req.params.designer_id
    await Designer.where({
        'id': designerId
    }).fetch({
        require: true
    }).then(designer => {
        res.status(200).send(designer.toJSON()); // convert collection to JSON
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve designer due to unexpected error.`
        })
        return;
    });
})

router.put('/:designer_id/update', async (req, res) => {
    const designer = await Designer.where({
        'id': req.params.designer_id
    }).fetch({
        require: true
    }).catch(_err => {
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Designer ID ${req.params.category_id}. Designer update failed. `
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
                "message": `Unable to update Designer ID ${req.params.category_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:designer_id/delete', async (req, res) => {
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

router.post('/create', async (req, res) => {
    const designer = new Designer();
    designer.set('name', req.body.name);
    await designer.save().then(() => {
        res.status(201).send({
            "success": true,
            "message": "New designer created successfully",
            "user_id": designer.get("id")
        })
    }).catch(_err => {
        res.status(500).send({
            "success": false,
            "message": `Unable to create new designer due to unexpected error.`
        })
    });;
})

module.exports = router;