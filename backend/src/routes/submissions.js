const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { v4: uuidv4 } = require('uuid');

// Public submission endpoint
router.post('/', (req, res) => {
  try {
    const { name, club_id, club_name, title, description, proof_url, proof_image_url } = req.body;
    if (!name || !title) {
      return res.status(400).json({ error: 'Name and achievement title are required' });
    }
    const id = uuidv4();
    db.prepare('INSERT INTO achievement_submissions (id, name, club_id, club_name, title, description, proof_url, proof_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, name, club_id, club_name, title, description, proof_url, proof_image_url);
    res.status(201).json({ data: { id }, message: 'Achievement submitted successfully! It will be reviewed shortly.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all submissions (for admin)
router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT s.*, c.name as resolved_club_name FROM achievement_submissions s LEFT JOIN clubs c ON s.club_id = c.id';
    const params = [];
    if (status) { query += ' WHERE s.status = ?'; params.push(status); }
    query += ' ORDER BY s.submitted_at DESC';
    res.json({ data: db.prepare(query).all(...params) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update submission status (for admin)
router.put('/:id', (req, res) => {
  try {
    const { status, reviewer_notes } = req.body;
    db.prepare('UPDATE achievement_submissions SET status=?, reviewer_notes=?, reviewed_at=datetime("now") WHERE id=?')
      .run(status, reviewer_notes, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
