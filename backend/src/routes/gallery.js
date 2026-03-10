const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    const { club_id, category, event_name, year, limit } = req.query;
    let query = 'SELECT g.*, c.name as club_name FROM gallery g LEFT JOIN clubs c ON g.club_id = c.id WHERE g.is_published = 1';
    const params = [];
    if (club_id) { query += ' AND g.club_id = ?'; params.push(club_id); }
    if (category) { query += ' AND g.category = ?'; params.push(category); }
    if (event_name) { query += ' AND g.event_name = ?'; params.push(event_name); }
    if (year) { query += ' AND g.year = ?'; params.push(parseInt(year)); }
    query += ' ORDER BY g.sort_order ASC, g.created_at DESC';
    if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
    res.json({ data: db.prepare(query).all(...params) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/filters', (req, res) => {
  try {
    const clubs = db.prepare('SELECT DISTINCT c.id, c.name FROM gallery g JOIN clubs c ON g.club_id = c.id WHERE g.is_published = 1').all();
    const events = db.prepare('SELECT DISTINCT event_name FROM gallery WHERE event_name IS NOT NULL AND is_published = 1').all().map(e => e.event_name);
    const years = db.prepare('SELECT DISTINCT year FROM gallery WHERE year IS NOT NULL AND is_published = 1 ORDER BY year DESC').all().map(y => y.year);
    const categories = db.prepare('SELECT DISTINCT category FROM gallery WHERE is_published = 1').all().map(c => c.category);
    res.json({ data: { clubs, events, years, categories } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, description, image_url, thumbnail_url, club_id, event_name, category, year, sort_order } = req.body;
    const id = require('uuid').v4();
    db.prepare('INSERT INTO gallery (id, title, description, image_url, thumbnail_url, club_id, event_name, category, year, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, title, description, image_url, thumbnail_url, club_id, event_name, category || 'General', year, sort_order || 0);
    res.status(201).json({ data: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
