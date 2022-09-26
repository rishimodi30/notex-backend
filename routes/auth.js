//const connectToMongo = require('./db');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "demosecretstring$";

//creating a user using POST "/api/auth/createuser",no login required

router.post('/createuser', [

    body('name', 'enter a valid name').isLength({ min: 5 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'enter a valid password').isLength({ min: 3 })

], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // finding if the user with same email exists
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "sorry user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json(authToken);
        // res.json(user);
    }
    catch (err) {
        console.error(error.message)
        res.status(500).send("internal server error occured");
    }
})

//authenticating a user using POST "/api/auth/login",no login required
router.post('/login', [

    body('email', 'enter a valid email').isEmail(),
    body('password', 'enter a valid password').isLength({ min: 3 })

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({email:email});
        if (!user) {
            res.status(400).json({ error: "please try to login with correct credentials" });
            return;
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            res.status(400).json({ error: "please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json(authtoken);
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send("internal server error occured");
    }


})
module.exports = router;

