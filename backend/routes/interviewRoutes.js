const express = require('express');
const router = express.Router();

router.post('/generate-questions', (req, res) => {
    const { cvText, jobDescription } = req.body;

    if (!cvText || !jobDescription) {
        return res.status(400).json({ error: 'CV Text and Job Description are required' });
    }

    // Mock AI question generation based on input
    const questions = [
        "Can you describe your experience with scalable web applications?",
        "How do you handle state management in React, and why choose one over the other?",
        "Tell me about a time you had to optimize performance for a complex UI.",
        "How do you ensure your code is maintainable and testable over time?",
        "What strategies do you use when debugging production issues?"
    ];

    res.json({
        message: 'Questions generated successfully',
        questions
    });
});

module.exports = router;
