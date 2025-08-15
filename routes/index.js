const express = require('express');
const router = express.Router();

// Basic API routes
router.get('/', (req, res) => {
  res.json({
    message: 'TalentTrack API v1',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    database: 'connected',
    version: '1.0.0'
  });
});

module.exports = router;