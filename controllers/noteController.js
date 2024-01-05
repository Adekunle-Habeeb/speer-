const express = require("express");
const Notes = require("../models/noteModel");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");


// Get all notes
const getNotes = expressAsyncHandler(async (req, res) => {
  try {
    const currentUser = req.user;

    const notes = await Notes.find({ createdBy: currentUser._id });

    res.json(notes);
  } catch (error) {
    console.error("Error retrieving notes:", error);
    res.status(500).json({ message: "Error retrieving notes" });
  }
});


// get note By Id
const getNoteById = expressAsyncHandler(async (req, res) => {
  const noteId = req.params.id; 
  const currentUser = req.user;

  
  const note = await Notes.findOne({ _id: noteId, createdBy: currentUser._id });
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.status(200).json(note);
});


// Create a new note
const createNote = expressAsyncHandler(async (req, res) => {
  const { title, content } = req.body;
  try {
    const currentUser = req.user;

    const newNote = new Notes({ title, content, createdBy: currentUser._id });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note" });
  }
});


// update an existing note
const updateNote = expressAsyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.id;
  try {
    const note = await Notes.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note" });
  }
});

// Delete a note
const deleteNote = expressAsyncHandler(async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Notes.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.deleteOne(); // Use deleteOne instead of remove
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note" });
  }
});


// share note
const shareNotes = expressAsyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const userIdToShareWith = req.body.userIdToShareWith;

  try {
    const [note, userToShareWith] = await Promise.all([
      Notes.findById(noteId),
      User.findById(userIdToShareWith),
    ]);

    if (!note || !userToShareWith || note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Note or user not found, or unauthorized" });
    }

    note.sharedWith.push(userToShareWith._id);
    await note.save();

    res.status(200).json({ message: "Note shared successfully" });
  } catch (error) {
    console.error("Error sharing note:", error);
    res.status(500).json({ message: "Error sharing note" });
  }
});

// search notes
const searchNotes = expressAsyncHandler(async (req, res) => {
  const query = req.query.q;

  try {
    const notes = await Notes.find({
      createdBy: req.user._id,
      $text: { $search: query },
    });

    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error searching notes:", error);
    res.status(500).json({ message: "Error searching notes" });
  }
});



module.exports = {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    shareNotes,
    searchNotes
};
