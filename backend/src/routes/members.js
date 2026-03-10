const express = require('express');
const router = express.Router();
const db = require('../models/database');

router.get('/', (req, res) => {
  try {
    const { club_id } = req.query;
    let query = 'SELECT m.*, c.name as club_name FROM members m LEFT JOIN clubs c ON m.club_id = c.id WHERE m.is_active = 1';
    const params = [];
    if (club_id) { query += ' AND m.club_id = ?'; params.push(club_id); }
    query += ' ORDER BY m.sort_order ASC, m.name ASC';
    res.json({ data: db.prepare(query).all(...params) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, club_id, role, title, bio, avatar_url, email, linkedin_url, github_url, instagram_url, year_of_study, sort_order } = req.body;
    const id = require('uuid').v4();
    db.prepare(`INSERT INTO members (id, club_id, name, role, title, bio, avatar_url, email, linkedin_url, github_url, instagram_url, year_of_study, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, club_id, name, role || 'Member', title, bio, avatar_url, email, linkedin_url, github_url, instagram_url, year_of_study, sort_order || 0);
    res.status(201).json({ data: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { name, club_id, role, title, bio, avatar_url, email, linkedin_url, github_url, instagram_url, year_of_study, sort_order, is_active } = req.body;
    db.prepare(`UPDATE members SET name=?, club_id=?, role=?, title=?, bio=?, avatar_url=?, email=?, linkedin_url=?, github_url=?, instagram_url=?, year_of_study=?, sort_order=?, is_active=? WHERE id=?`)
      .run(name, club_id, role, title, bio, avatar_url, email, linkedin_url, github_url, instagram_url, year_of_study, sort_order, is_active, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM members WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
