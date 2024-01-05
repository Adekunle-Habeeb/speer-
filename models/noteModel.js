const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  sharedWith: {
    type: Array,
    default: [],
  }
}, { timestamps: true });

noteSchema.index({ title: "text" })

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;