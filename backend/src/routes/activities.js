const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    const { type, club_id, limit } = req.query;
    let query = 'SELECT a.*, c.name as club_name FROM activities a LEFT JOIN clubs c ON a.club_id = c.id WHERE a.is_published = 1';
    const params = [];
    if (type) { query += ' AND a.type = ?'; params.push(type); }
    if (club_id) { query += ' AND a.club_id = ?'; params.push(club_id); }
    query += ' ORDER BY a.date DESC, a.sort_order ASC';
    if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
    res.json({ data: db.prepare(query).all(...params) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, description, type, category, club_id, date, location, image_url, sort_order } = req.body;
    const id = require('uuid').v4();
    db.prepare('INSERT INTO activities (id, title, description, type, category, club_id, date, location, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, title, description, type || 'technical', category, club_id, date, location, image_url, sort_order || 0);
    res.status(201).json({ data: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { title, description, type, category, club_id, date, location, image_url, is_published, sort_order } = req.body;
    db.prepare('UPDATE activities SET title=?, description=?, type=?, category=?, club_id=?, date=?, location=?, image_url=?, is_published=?, sort_order=? WHERE id=?')
      .run(title, description, type, category, club_id, date, location, image_url, is_published ? 1 : 0, sort_order, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
