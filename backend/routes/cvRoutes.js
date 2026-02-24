const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for CV uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload', upload.single('cv'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file' });
    }

    // Normally here we would parse the PDF/DOCX and extract text using pdf-parse or similar
    // We will just return success for the mock implementation

    res.json({
        message: 'File uploaded and parsed successfully',
        file: req.file.filename,
        extractedText: "Mock extracted text from candidate CV."
    });
});

module.exports = router;
