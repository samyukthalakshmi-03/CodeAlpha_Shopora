const express = require('express');
const router = express.Router();

const products = require('../data/products.json');

// Get all products
router.get('/', (req, res) => {
    res.json(products);
});

// Get single product
router.get('/:id', (req, res) => {

    const product = products.find(p => p.id == req.params.id);

    if(product){
        res.json(product);
    }
    else{
        res.status(404).json({message:"Product not found"});
    }

});

module.exports = router;