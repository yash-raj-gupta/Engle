const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createNote, getAllNotes,getSomeRecentNotes,getNoteById,deleteNote,updateNote} = require('../controllers/notesControllers');
const rateLimit = require("express-rate-limit");

//Middle ware to prevent DDOS
const noteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  status:"error",
  message: "Too many note creation requests created from this IP, please try again after 15 minutes"
});
// Route for creating a new note
router.post('/createnote', [
  body('word', 'Value must be a string').isString().notEmpty().withMessage('Word must be a non-empty string'),
  body('type', 'Value must be a string').isString().notEmpty().withMessage('Type must be a non-empty string'),
  body('definitions', 'Value must be a string').isString().notEmpty().withMessage('Definitions must be a non-empty string'),
  body('example', 'Value must be a string').isString().notEmpty().withMessage('Example must be a non-empty string'),
  body('breakdown', 'Value must be a string').isString().notEmpty().withMessage('Word Breakdown must be a non-empty string'),
],noteLimiter, createNote);

// Route for getting all notes
router.post('/getallnotes',getAllNotes);

// Route for getting a specific note by ID
router.get('/getnote/:id', getNoteById);

//Route for getting recent 5 notes
router.post('/getrecentnotes',getSomeRecentNotes);

router.post('/deletenote',deleteNote);
router.post('/updatenote',updateNote);

module.exports = router;
