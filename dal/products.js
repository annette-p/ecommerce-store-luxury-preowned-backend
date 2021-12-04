const {
    Category,
    Designer,
    Product
} = require("../models");

async function getAllProducts() {
    try {
        let products = await Product.collection().fetch({
            withRelated: ["category", "designer", "insurance", "tags"]
        });
        return products;
    } catch(err) {
        throw err
    }
}

async function getProductById(productId) {
    try {
        let product = await Product.where({
            'id': productId
        }).fetch({
            require: false,
            withRelated: ["category", "designer", "insurance", "tags"]
        });
        return product;
    } catch(err) {
        throw err;
    }
    
}

async function updateProduct(productId, productData) {
    const product = await getProductById(productId);
    try {
        if (product) {
            if (productData.name) { product.set('name', productData.name); }
            if (productData.designer_id) { product.set('designer_id', productData.designer_id); }
            if (productData.category_id) { product.set('category_id', productData.category_id); }
            if (productData.insurance_id) { product.set('insurance_id', productData.insurance_id); }
            if (productData.quantity) { product.set('quantity', productData.quantity); }
            
            if (productData.retail_price) { product.set('retail_price', productData.retail_price); }
            if (productData.selling_price) { product.set('selling_price', productData.selling_price); }
            if (productData.description) { product.set('description', productData.description); }
            if (productData.specifications) { product.set('specifications', productData.specifications) };
            if (productData.condition) { product.set('condition', productData.condition); }
            if (productData.condition_description) { product.set('condition_description', productData.condition_description); }
            if (productData.sku) { product.set('sku', productData.sku); }
            if (productData.authenticity) { product.set('authenticity', productData.authenticity); }
            if (productData.product_image_1) { product.set('product_image_1', productData.product_image_1); }
            if (productData.product_image_2) { product.set('product_image_2', productData.product_image_2); }
            if (productData.product_gallery_1) { product.set('product_gallery_1', productData.product_gallery_1); }
            if (productData.product_gallery_2) { product.set('product_gallery_2', productData.product_gallery_2); }
            if (productData.product_gallery_3) { product.set('product_gallery_3', productData.product_gallery_3); }
            if (productData.product_gallery_4) { product.set('product_gallery_4', productData.product_gallery_4); }
            if (productData.product_gallery_5) { product.set('product_gallery_5', productData.product_gallery_5); }
            if (productData.product_gallery_6) { product.set('product_gallery_6', productData.product_gallery_6); }
            if (productData.product_gallery_7) { product.set('product_gallery_7', productData.product_gallery_7); }
            if (productData.product_gallery_8) { product.set('product_gallery_8', productData.product_gallery_8); }
            if (productData.claim_date) { product.set('claim_date', productData.claim_date); }
            if (productData.claim_amount) { product.set('claim_amount', productData.claim_amount); }
            if (productData.active) { product.set('authenticity', productData.active); }
    
            product.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
    
            await product.save();
    
            if (productData.tags) {
                // handle tags
                let tagIds = productData.tags.split(",");
                let existinTagIds = await product.related("tags").pluck("id");
    
                // remove all the tags that are not selected anymore
                let tagsToRemove = existinTagIds.filter( id => tagIds.includes(id) === false);
                await product.tags().detach(tagsToRemove);
    
                // add in all the tags selected
                await product.tags().attach(tagIds);
            }
    
            return true;
            
        } else {
            return false;
        }
    } catch(err) {
        throw err
    }
    
}

async function deleteProduct(productId) {
    try {
        const product = await Product.where({
            'id': productId
        }).fetch({
            require: false
        });
    
        if (product) {
            await product.destroy();
            return true
        } else {
            return false;
        }
    } catch(err) {
        throw err;
    }
}

async function createProduct(productData) {
    try {
        const product = new Product();

        product.set('designer_id', productData.designer_id);
        product.set('category_id', productData.category_id);
        product.set('insurance_id', productData.insurance_id);
        product.set('name', productData.name);
        product.set('retail_price', productData.retail_price);
        product.set('selling_price', productData.selling_price);
        product.set('description', productData.description);
        product.set('specifications', productData.specifications);
        product.set('condition', productData.condition);
        product.set('condition_description', productData.condition_description);
        product.set('sku', productData.sku);
        product.set('quantity', productData.quantity);
        product.set('authenticity', productData.authenticity);
        product.set('product_image_1', productData.product_image_1);
        product.set('product_image_2', productData.product_image_2);
        product.set('product_gallery_1', productData.product_gallery_1);
        product.set('product_gallery_2', productData.product_gallery_2);
        product.set('product_gallery_3', productData.product_gallery_3);
        product.set('product_gallery_4', productData.product_gallery_4);
        product.set('product_gallery_5', productData.product_gallery_5);
        product.set('product_gallery_6', productData.product_gallery_6);
        product.set('product_gallery_7', productData.product_gallery_7);
        product.set('product_gallery_8', productData.product_gallery_8);
        product.set('claim_date', productData.claim_date);
        product.set('claim_amount', productData.claim_amount);
        const isActive = false;
        if (productData.active) {
            isActive = productData.active;
        }
        product.set('active', isActive);
        product.set('created_at', new Date().toISOString().slice(0, 19).replace('T', ' '));
        product.set('updated_at', new Date().toISOString().slice(0, 19).replace('T', ' '));

        await product.save();

        // handle tags
        if (productData.tags) {
            await product.tags().attach(productData.tags.split(","));
        }

        return product.get("id");
    } catch(err) {
        throw err;
    }
}

// ************** Manage Product Designers **************

async function getAllDesigners() {
    try {
        let designers = await Designer.collection().fetch();
        return designers;
    } catch(err) {
        throw err;
    }
}

async function getDesignerById(designerId) {
    try {
        let designer = await Designer.where({
            'id': designerId
        }).fetch({
            require: false
        });
        return designer;
    } catch(err) {
        throw err;
    }
}




module.exports = {
    createProduct,
    deleteProduct,
    getAllDesigners, getDesignerById,
    getAllProducts, getProductById,
    updateProduct
}