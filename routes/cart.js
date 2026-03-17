const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carts.json');

function getCart() {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveCart(cart) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(cart, null, 2));
}

// Add to cart
router.post('/', (req, res) => {
    const product = req.body;
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    res.json({ message: "Product added to cart", cart });
});

// Get cart items
router.get('/', (req, res) => {
    res.json(getCart());
});

// Clear cart
router.delete('/', (req, res) => {
    saveCart([]);
    res.json({ message: "Cart cleared" });
});

// Remove specific item from cart
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cart = getCart();
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart(cart);
        res.json({ message: "Item removed from cart", cart });
    } else {
        res.status(404).json({ message: "Item not found in cart" });
    }
});

module.exports = router;
