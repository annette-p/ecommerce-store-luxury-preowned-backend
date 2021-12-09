const express = require("express");
const router = express.Router();

const {
    checkIfAuthenticatedJWT,
    checkIsAdminJWT
} = require('../../middlewares/authentication')

// import the Designer model
const {
    Insurance
} = require('../../models');

router.get('/', async (_req, res) => {
    // fetch all the insurances (i.e., SELECT * FROM insurances)

    await Insurance.collection().fetch().then(insurances => {
        res.status(200).send({
            "success": true,
            "data": insurances.toJSON()
        });
    }).catch(err => {
        console.error("[Exception -> Insurances GET '/' Route] ", err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve insurances due to unexpected error.`
        })
        return;
    });
})

router.get('/:insurance_id', async (req, res) => {
    // fetch a insurance by primary key "id"
    const insuranceId = req.params.insurance_id
    await Insurance.where({
        'id': insuranceId
    }).fetch({
        require: true
    }).then(insurance => {
        res.status(200).send({
            "success": true,
            "data": insurance.toJSON()
        }); // convert collection to JSON
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            "success": false,
            "message": `Unable to retrieve insurance due to unexpected error.`
        })
        return;
    });
})

router.put('/:insurance_id/update', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const insurance = await Insurance.where({
        'id': req.params.insurance_id
    }).fetch({
        require: true
    }).catch(err => {
        console.log(err)
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Insurance ID ${req.params.insurance_id}. Insurance update failed. `
        })
        return;
    });

    if (insurance !== undefined) {

        if (req.body.company_name) { insurance.set('company_name', req.body.company_name); }
        if (req.body.policy_name) { insurance.set('policy_name', req.body.policy_name); }
        if (req.body.policy_date) { insurance.set('policy_date', req.body.policy_date); }
        if (eq.body.coverage_amount) { insurance.set('coverage_amount', req.body.coverage_amount); }
        insurance.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await insurance.save().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Insurance ID ${req.params.insurance_id} updated successfully`
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                "success": false,
                "message": `Unable to update Insurance ID ${req.params.insurance_id} due to unexpected error.`
            })
        });
    }

})

router.delete('/:insurance_id/delete', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const insurance = await Insurance.where({
        'id': req.params.insurance_id
    }).fetch({
        require: true
    }).catch(err => {
        console.log(err)
        res.status(404).send({
            "success": false,
            "message": `Unable to retrieve Insurance ID ${req.params.insurance_id}. Insurance deletion failed. `
        })
        return;
    });

    if (insurance !== undefined) {
        await insurance.destroy().then(() => {
            res.status(200).send({
                "success": true,
                "message": `Insurance ID ${req.params.insurance_id} deleted successfully`
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                "success": false,
                "message": `Unable to delete Designer ID ${req.params.insurance_id} due to unexpected error.`
            })
        });
    }

})

router.post('/create', [checkIfAuthenticatedJWT, checkIsAdminJWT], async (req, res) => {
    const insurance = new Insurance();
    insurance.set('company_name', req.body.company_name);
    insurance.set('policy_name', req.body.policy_name);
    insurance.set('policy_date', req.body.policy_date);
    insurance.set('coverage_amount', req.body.coverage_amount);
    insurance.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
    insurance.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
    await insurance.save().then(() => {
        res.status(201).send({
            "success": true,
            "message": "New insurance created successfully",
            "insurance_id": insurance.get("id")
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            "success": false,
            "message": `Unable to create new insurance due to unexpected error.`
        })
    });;
})

module.exports = router;