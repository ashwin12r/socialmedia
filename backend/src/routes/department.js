const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    let info = db.prepare('SELECT * FROM department_info WHERE id = ?').get('main');
    if (!info) {
      db.prepare('INSERT INTO department_info (id) VALUES (?)').run('main');
      info = db.prepare('SELECT * FROM department_info WHERE id = ?').get('main');
    }
    info.highlights = JSON.parse(info.highlights || '[]');
    info.stats = JSON.parse(info.stats || '{}');
    res.json({ data: info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', (req, res) => {
  try {
    const { name, description, vision, mission, highlights, stats } = req.body;
    db.prepare('UPDATE department_info SET name=?, description=?, vision=?, mission=?, highlights=?, stats=?, updated_at=datetime("now") WHERE id=?')
      .run(name, description, vision, mission, JSON.stringify(highlights || []), JSON.stringify(stats || {}), 'main');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
