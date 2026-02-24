const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const cvRoutes = require('./routes/cvRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/evaluation', evaluationRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the AI Mock Interview API' });
});

// Error handling payload
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
