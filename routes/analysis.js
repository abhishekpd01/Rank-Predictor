// routes/analysis.js
const express = require('express');
const router = express.Router();
const QuizSubmission = require('../models/QuizSubmission');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// GET /analysis/:userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch last 5 quiz submissions sorted by submission date descending.
    const submissions = await QuizSubmission.find({ user: userId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate('quiz');

    if (!submissions.length) {
      return res.status(404).json({ message: 'No quiz submissions found for analysis' });
    }

    // Calculate average score
    const avgScore = submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length;

    // Build topic performance data
    const topicStats = {}; // { topic: { correct: x, total: y } }
    submissions.forEach((submission) => {
      // For each submission, we need to get the topic info from quiz questions.
      submission.quiz.questions.forEach((question) => {
        // Initialize if not exist
        if (!topicStats[question.topic]) {
          topicStats[question.topic] = { correct: 0, total: 0 };
        }
        topicStats[question.topic].total += 1;
        // Check if the submission has a response for this question and if it was correct.
        const userAnswer = submission.responses.get ? submission.responses.get(question.id) : submission.responses[question.id];
        if (userAnswer && userAnswer === question.correctAnswer) {
          topicStats[question.topic].correct += 1;
        }
      });
    });

    // Identify weak topics: those where correct percentage is below a threshold (say 60%)
    const weakTopics = [];
    Object.keys(topicStats).forEach((topic) => {
      const { correct, total } = topicStats[topic];
      const percentage = (correct / total) * 100;
      if (percentage < 60) {
        weakTopics.push({ topic, percentage });
      }
    });

    // Rank Prediction:
    // For this example, we compute a composite score: (avgScore * weight1) + (pastNeetScore * weight2)
    // Then we rank all users by this composite score.
    const weight1 = 1;
    const weight2 = 0.01; // past NEET scores can be high numbers so we scale them down
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    // Calculate composite score for the current user
    const currentComposite = avgScore * weight1 + currentUser.pastNeetScore * weight2;

    // Get composite scores for all users who have at least one submission
    const allUsers = await User.find().populate('quizSubmissions');
    let ranking = 1;
    for (let user of allUsers) {
      // Skip if the user has no quiz submissions (or assume score 0)
      if (!user.quizSubmissions || user.quizSubmissions.length === 0) continue;

      // Calculate average score from the last 5 submissions for the user
      const submissions = await QuizSubmission.find({ user: user._id })
        .sort({ submittedAt: -1 })
        .limit(5);
      const userAvgScore = submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length;
      const compositeScore = userAvgScore * weight1 + user.pastNeetScore * weight2;
      if (compositeScore > currentComposite) ranking++;
    }

    res.json({
      averageScore: avgScore,
      weakTopics,
      predictedRank: ranking,
      analysisDetails: topicStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
