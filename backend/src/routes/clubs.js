const express = require('express');
const router = express.Router();
const db = require('../models/database');

// GET all clubs
router.get('/', (req, res) => {
  try {
    const clubs = db.prepare('SELECT * FROM clubs WHERE is_active = 1 ORDER BY sort_order ASC, name ASC').all();
    const parsed = clubs.map(c => ({ ...c, social_links: JSON.parse(c.social_links || '{}') }));
    res.json({ data: parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single club by slug
router.get('/:slug', (req, res) => {
  try {
    const club = db.prepare('SELECT * FROM clubs WHERE slug = ?').get(req.params.slug);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    club.social_links = JSON.parse(club.social_links || '{}');
    
    const members = db.prepare('SELECT * FROM members WHERE club_id = ? AND is_active = 1 ORDER BY sort_order ASC').all(club.id);
    const achievements = db.prepare('SELECT * FROM achievements WHERE club_id = ? AND is_published = 1 ORDER BY date DESC').all(club.id);
    const galleryItems = db.prepare('SELECT * FROM gallery WHERE club_id = ? AND is_published = 1 ORDER BY sort_order ASC').all(club.id);
    
    res.json({ data: { ...club, members, achievements, gallery: galleryItems } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create club (for admin API)
router.post('/', (req, res) => {
  try {
    const { id, name, slug, tagline, description, logo_url, cover_url, color, icon, activities, social_links, member_count, founded_year, sort_order } = req.body;
    const clubId = id || require('uuid').v4();
    db.prepare(`INSERT INTO clubs (id, name, slug, tagline, description, logo_url, cover_url, color, icon, activities, social_links, member_count, founded_year, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(clubId, name, slug, tagline, description, logo_url, cover_url, color || '#6366f1', icon || 'Users', activities, JSON.stringify(social_links || {}), member_count || 0, founded_year, sort_order || 0);
    res.status(201).json({ data: { id: clubId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update club
router.put('/:id', (req, res) => {
  try {
    const { name, slug, tagline, description, logo_url, cover_url, color, icon, activities, social_links, member_count, founded_year, sort_order, is_active } = req.body;
    db.prepare(`UPDATE clubs SET name=?, slug=?, tagline=?, description=?, logo_url=?, cover_url=?, color=?, icon=?, activities=?, social_links=?, member_count=?, founded_year=?, sort_order=?, is_active=?, updated_at=datetime('now') WHERE id=?`)
      .run(name, slug, tagline, description, logo_url, cover_url, color, icon, activities, JSON.stringify(social_links || {}), member_count, founded_year, sort_order, is_active, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
