const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

function getUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Register
router.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const users = getUsers();
    
    // Basic check for existing user
    if (users.find(u => u.email === email)) {
        return res.status(400).json({message:"Email already registered"});
    }

    users.push({name, email, password});
    saveUsers(users);

    res.json({message:"User registered successfully"});
});

// Login
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    const users = getUsers();

    const user = users.find(u =>
        u.email === email && u.password === password
    );

    if(user){
        res.json({message:"Login successful"});
    }
    else{
        res.status(401).json({message:"Invalid credentials"});
    }
});

module.exports = router;