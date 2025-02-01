// routes/quiz.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const User = require('../models/User');

// GET /quiz/:quizId – retrieve a quiz
router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ id: req.params.quizId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /quiz/:quizId/submit – submit quiz responses
router.post('/:quizId/submit', async (req, res) => {
  const { userId, responses } = req.body;
  try {
    const quiz = await Quiz.findOne({ id: req.params.quizId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Calculate score and total correct
    let score = 0;
    let totalCorrect = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = responses.get ? responses.get(question.id) : responses[question.id];
      if (userAnswer && userAnswer === question.correctAnswer) {
        totalCorrect += 1;
        score += 1; // For simplicity, each correct answer adds one point.
      }
    });

    // Create the quiz submission
    const submission = new QuizSubmission({
      user: userId,
      quiz: quiz._id,
      responses,
      score,
      totalCorrect
    });
    await submission.save();

    // Save reference to user's submissions
    await User.findByIdAndUpdate(userId, { $push: { quizSubmissions: submission._id } });

    res.json({ message: 'Quiz submitted successfully', score, totalCorrect, submissionId: submission._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
