const express = require("express");
const Router = express.Router();
const { getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    shareNotes,
    searchNotes } = require("../controllers/noteController");


const { protect } = require("../middleware/authMiddleware");

Router.get("/notes", protect, getNotes);
Router.get("/notes/:id", protect, getNoteById);
Router.post("/notes", protect, createNote);
Router.put("/notes/:id", protect, updateNote);
Router.delete("/notes/:id", protect, deleteNote);
Router.post("/notes/:id/share", protect, shareNotes);
Router.get("/search/", protect, searchNotes);

module.exports = Router;