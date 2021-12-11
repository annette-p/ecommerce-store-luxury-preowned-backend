const {
    Category,
    Designer,
    Product
} = require("../models");

// List of valid product conditions
function getProductConditionList() {
    return [
        "New, with tag",
        "Never worn",
        "Pristine",
        "Good",
        "Fair",
        "Vintage"
    ]
}

/*  Retrieve products, with optional search filter

The supported search criteria are:
- whether a product is active (e.g. /products?active=true)
- products that have a mininum balance (e.g. /products?min_quantity=1)
- products under a specific category id (e.g. /products?category_id=2)
- products under a specific designer id (e.g. /products?designer_id=4)
- products under a specific tag id (e.g. /products?tag_id=3)
- products with a given text in product name, description, specification or designer name (e.g. /products?search=prada+bag)

*/
async function getAllProducts(searchCriteria) {
    console.log("getAllProducts() - searchCriteria: ", searchCriteria)
    try {
        // Prepare the query for searching products
        let q = Product.collection();
        q = q.query("join", "designers", "designer_id", "designers.id")

        // 'products' table and 'tags' table have many-to-many relationship,
        // hence using 2 'join' for query based on tag id.
        // ref: https://stackoverflow.com/a/56147245
        q = q.query("join", "products_tags", "products.id", "products_tags.product_id");
        q = q.query("join", "tags", "products_tags.tag_id", "tags.id");

        q.where( (qb) => {
            // add a default search filter that will always return true.
            // this is necessary because there search filter input is optional
            // ref: https://stackoverflow.com/a/1264693
            qb.where(1, 1)

            if (searchCriteria.hasOwnProperty("active")) {
                qb.andWhere("active", searchCriteria.active === "true" ? 1 : 0)
            }

            if (searchCriteria.hasOwnProperty("min_quantity")) {
                qb.andWhere("quantity", ">=", parseInt(searchCriteria.min_quantity))
            }

            if (searchCriteria.hasOwnProperty("category_id")) {
                qb.andWhere("category_id", parseInt(searchCriteria.category_id))
            }

            if (searchCriteria.hasOwnProperty("designer_id")) {
                qb.andWhere("designer_id", parseInt(searchCriteria.designer_id))
            }

            if (searchCriteria.hasOwnProperty("tag_id")) {
                qb.andWhere("tags.id", parseInt(searchCriteria.tag_id))
            }

            if (searchCriteria.hasOwnProperty("search")) {

                // using multiple "or" conditions to match the same search text in 
                // multiple table columns
                // ref: https://stackoverflow.com/a/67377259
                qb.andWhere( (qb1) => {

                    searchCriteria.search.split(" ").forEach( searchWord => {
                        // ignore spaces, and handle search text
                        if (searchWord.trim().length > 0) {
                            qb1.whereRaw("LOWER(designers.name) like ?", `%${searchWord.toLowerCase()}%`)
                                .orWhere("products.name", "like", `%${searchWord}%`)
                                .orWhere("description", "like", `%${searchWord}%`)
                                .orWhere("specifications", "like", `%${searchWord}%`)
                        }
                    })
                    
                })
            }
        })

        let products = await q.fetch({
            withRelated: ["category", "consignment", "designer", "insurance", "tags"]
        })

        return products;
    } catch(err) {
        console.log(err)
        throw err
    }
}

async function getProductById(productId) {
    try {
        let product = await Product.where({
            'id': productId
        }).fetch({
            require: false,
            withRelated: ["category", "consignment", "designer", "insurance", "tags"]
        });
        return product;
    } catch(err) {
        console.log(`dal/products.js getProductById() for product id ${productId} - ERROR: `, err)
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
            if (productData.hasOwnProperty('authenticity')) { product.set('authenticity', productData.authenticity); }
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
            if (productData.hasOwnProperty('active')) { product.set('active', productData.active); }
    
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
        let isActive = false;
        if (productData.hasOwnProperty('active')) {
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
    getProductConditionList,
    updateProduct
}