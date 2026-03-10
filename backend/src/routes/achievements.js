const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    const { club_id, category, featured, limit } = req.query;
    let query = 'SELECT a.*, c.name as club_name FROM achievements a LEFT JOIN clubs c ON a.club_id = c.id WHERE a.is_published = 1';
    const params = [];
    if (club_id) { query += ' AND a.club_id = ?'; params.push(club_id); }
    if (category) { query += ' AND a.category = ?'; params.push(category); }
    if (featured) { query += ' AND a.is_featured = 1'; }
    query += ' ORDER BY a.date DESC, a.sort_order ASC';
    if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
    res.json({ data: db.prepare(query).all(...params) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, description, club_id, category, date, image_url, proof_url, is_featured, sort_order } = req.body;
    const id = require('uuid').v4();
    db.prepare('INSERT INTO achievements (id, title, description, club_id, category, date, image_url, proof_url, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, title, description, club_id, category || 'Department', date, image_url, proof_url, is_featured ? 1 : 0, sort_order || 0);
    res.status(201).json({ data: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { title, description, club_id, category, date, image_url, proof_url, is_featured, is_published, sort_order } = req.body;
    db.prepare('UPDATE achievements SET title=?, description=?, club_id=?, category=?, date=?, image_url=?, proof_url=?, is_featured=?, is_published=?, sort_order=? WHERE id=?')
      .run(title, description, club_id, category, date, image_url, proof_url, is_featured ? 1 : 0, is_published ? 1 : 0, sort_order, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM achievements WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
