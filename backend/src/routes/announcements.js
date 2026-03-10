const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    const { tag, limit } = req.query;
    let query = 'SELECT a.*, c.name as club_name FROM announcements a LEFT JOIN clubs c ON a.club_id = c.id WHERE a.is_published = 1';
    const params = [];
    if (tag) { query += ' AND a.tag = ?'; params.push(tag); }
    query += ' ORDER BY a.is_pinned DESC, a.published_at DESC';
    if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
    res.json({ data: db.prepare(query).all(...params) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT a.*, c.name as club_name FROM announcements a LEFT JOIN clubs c ON a.club_id = c.id WHERE a.id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, content, tag, club_id, is_pinned } = req.body;
    const id = require('uuid').v4();
    db.prepare('INSERT INTO announcements (id, title, content, tag, club_id, is_pinned) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, title, content, tag || 'General', club_id, is_pinned ? 1 : 0);
    res.status(201).json({ data: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { title, content, tag, club_id, is_pinned, is_published } = req.body;
    db.prepare('UPDATE announcements SET title=?, content=?, tag=?, club_id=?, is_pinned=?, is_published=? WHERE id=?')
      .run(title, content, tag, club_id, is_pinned ? 1 : 0, is_published ? 1 : 0, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
