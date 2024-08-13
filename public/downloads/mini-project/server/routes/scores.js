const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// @route   POST api/scores
// @desc    Add a new score
router.post('/', scoreController.addScore);

// @route   GET api/scores
// @desc    Get top 10 scores
router.get('/', scoreController.getScores);

module.exports = router;
