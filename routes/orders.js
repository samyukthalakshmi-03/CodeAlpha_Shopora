const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../data/orders.json');

function getOrders() {
    try {
        const data = fs.readFileSync(ordersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveOrders(orders) {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}

// Place order
router.post('/', (req, res) => {
    const order = req.body;
    order.id = Date.now(); // simple ID generation
    
    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);

    res.json({
        message:"Order placed successfully",
        order
    });
});

// Get all orders
router.get('/', (req, res) => {
    res.json(getOrders());
});

module.exports = router;