const express = require('express');
const router = express.Router();

router.post('/evaluate-answer', (req, res) => {
    const { questionId, answerText } = req.body;

    if (!questionId || !answerText) {
        return res.status(400).json({ error: 'Question ID and Answer Text are required' });
    }

    // Mock AI evaluation
    const evaluation = {
        score: Math.floor(Math.random() * 4) + 6, // Random score between 6 and 9
        strengths: ["Clear communication", "Relevant examples"],
        weaknesses: ["Lacked deep technical depth in some areas"],
        improvements: ["Try to structure answers using the STAR format"]
    };

    res.json({
        message: 'Answer evaluated successfully',
        evaluation
    });
});

module.exports = router;
