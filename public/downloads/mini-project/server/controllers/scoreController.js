const Score = require('../models/Score');

exports.addScore = async (req, res) => {
  const { username, score } = req.body;

  try {
    let newScore = new Score({
      username,
      score
    });

    await newScore.save();
    res.json(newScore);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getScores = async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
