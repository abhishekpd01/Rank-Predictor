// models/Quiz.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  topic: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema);
