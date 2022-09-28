
//const connectToMongo = require('./db');
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//ROUTE::1 fetching all notes of a user using GET "/api/auth/fetchallnotes","login required"
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

//ROUTE::2 Add a new note using POST "/api/auth/addnote","login required"

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

//ROUTE::3 Update an existing note using PUT "/api/auth/updatenote/:id","login required"
router.put('/updatenote/:id', fetchUser, [

    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'enter a valid description').isLength({ min: 10 }),
    body('tag', 'enter a valid tag').isLength({ min: 3 })

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { title, description, tag } = req.body;
        const newNote = {};

        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        let note = await Note.findById(req.params.id);

        if (!note) {

            return res.status(404).send("not found");
        }
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("not allowed");
        }

         note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
         res.json({note});

    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured");
    }
})

module.exports = router;

//ROUTE::4 delete a note using DELETE "/api/auth/deletenote/:id","login required"
router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    try {


        let note = await Note.findById(req.params.id);

        if (!note) {

            return res.status(404).send("not found");
        }
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("not allowed");
        }

         note = await Note.findByIdAndDelete(req.params.id);

         res.send(note);

    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured");
    }
})

module.exports = router;