
//const connectToMongo = require('./db');
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//ROUTE::1 creating a user using GET "/api/auth/fetchallnotes","no login required"
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured");
    }
})

//ROUTE::2 Add a new note using POST "/api/auth/addnote","no login required"
router.post('/addnote', fetchUser, [

    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'enter a valid description').isLength({ min: 10 }),
    // body('date', 'enter a valid password').isDate()

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //fetching data from the request
        const { title, description, tag } = req.body;
        // creating a new note using above parms
        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const notes = await Note.find({ user: req.user.id });
        const savedNote = await note.save();
        res.send(savedNote);
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured");
    }
})

module.exports = router;