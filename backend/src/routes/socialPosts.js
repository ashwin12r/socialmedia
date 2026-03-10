const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    const { club_id, platform, limit } = req.query;
    let query = 'SELECT sp.*, c.name as club_name FROM social_posts sp LEFT JOIN clubs c ON sp.club_id = c.id WHERE sp.is_published = 1';
    const params = [];
    if (club_id) { query += ' AND sp.club_id = ?'; params.push(club_id); }
    if (platform) { query += ' AND sp.platform = ?'; params.push(platform); }
    query += ' ORDER BY sp.posted_at DESC';
    if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
    res.json({ data: db.prepare(query).all(...params) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { platform, post_url, embed_html, caption, image_url, club_id, posted_at, sort_order } = req.body;
    const id = require('uuid').v4();
    db.prepare('INSERT INTO social_posts (id, platform, post_url, embed_html, caption, image_url, club_id, posted_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, platform, post_url, embed_html, caption, image_url, club_id, posted_at || new Date().toISOString(), sort_order || 0);
    res.status(201).json({ data: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM social_posts WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
