// models/QuizSubmission.js
const mongoose = require('mongoose');

const QuizSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  responses: {
    // example: { 'questionId': 'selectedOption' }
    type: Map,
    of: String,
    required: true
  },
  score: { type: Number, required: true },
  totalCorrect: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizSubmission', QuizSubmissionSchema);
