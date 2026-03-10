const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    const clubCount = db.prepare('SELECT COUNT(*) as count FROM clubs WHERE is_active = 1').get().count;
    const memberCount = db.prepare('SELECT COUNT(*) as count FROM members WHERE is_active = 1').get().count;
    const achievementCount = db.prepare('SELECT COUNT(*) as count FROM achievements WHERE is_published = 1').get().count;
    const eventCount = db.prepare('SELECT COUNT(*) as count FROM activities WHERE is_published = 1').get().count;
    const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery WHERE is_published = 1').get().count;
    
    res.json({
      data: {
        clubs: clubCount,
        members: memberCount,
        achievements: achievementCount,
        events: eventCount,
        gallery_items: galleryCount
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
