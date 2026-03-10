const express = require('express');
const router = express.Router();
const db = require('../models/database');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// GET /api/users/me - get current user profile
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, name, email, avatar_url, bio, year_of_study, department, 
             referral_code, profile_completed, easter_eggs_found, xp_points, created_at
      FROM users WHERE id = ?
    `).get(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.easter_eggs_found = JSON.parse(user.easter_eggs_found || '[]');

    // Calculate profile completion
    const fields = ['name', 'email', 'avatar_url', 'bio', 'year_of_study', 'department'];
    const filled = fields.filter(f => user[f] && user[f].trim()).length;
    const profile_percent = Math.round((filled / fields.length) * 100);

    // Get achievement submissions count
    const submissions = db.prepare('SELECT COUNT(*) as count FROM achievement_submissions WHERE name = ?').get(user.name);

    // Get referrals count
    const referrals = db.prepare("SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ? AND status = 'completed'").get(user.id);

    res.json({
      data: {
        ...user,
        profile_percent,
        achievements_submitted: submissions.count,
        referrals_count: referrals.count,
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
});

// PUT /api/users/me - update profile
router.put('/me', authMiddleware, (req, res) => {
  try {
    const { name, avatar_url, bio, year_of_study, department } = req.body;

    db.prepare(`
      UPDATE users SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url),
      bio = COALESCE(?, bio), year_of_study = COALESCE(?, year_of_study),
      department = COALESCE(?, department), updated_at = datetime('now')
      WHERE id = ?
    `).run(name, avatar_url, bio, year_of_study, department, req.user.id);

    // Recalculate profile completion
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const fields = ['name', 'email', 'avatar_url', 'bio', 'year_of_study', 'department'];
    const filled = fields.filter(f => user[f] && user[f].trim()).length;
    const profile_completed = filled === fields.length ? 1 : 0;
    db.prepare('UPDATE users SET profile_completed = ? WHERE id = ?').run(profile_completed, req.user.id);

    // Return updated user
    const updated = db.prepare(`
      SELECT id, name, email, avatar_url, bio, year_of_study, department, 
             referral_code, profile_completed, easter_eggs_found, xp_points, created_at
      FROM users WHERE id = ?
    `).get(req.user.id);
    updated.easter_eggs_found = JSON.parse(updated.easter_eggs_found || '[]');

    res.json({ data: updated });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/users/easter-egg - discover an easter egg
router.post('/easter-egg', authMiddleware, (req, res) => {
  try {
    const { egg_id } = req.body;
    if (!egg_id) return res.status(400).json({ error: 'egg_id is required.' });

    const user = db.prepare('SELECT easter_eggs_found, xp_points FROM users WHERE id = ?').get(req.user.id);
    const found = JSON.parse(user.easter_eggs_found || '[]');

    if (found.includes(egg_id)) {
      return res.json({ data: { already_found: true, eggs: found, xp: user.xp_points } });
    }

    found.push(egg_id);
    const xpReward = 25;
    db.prepare('UPDATE users SET easter_eggs_found = ?, xp_points = xp_points + ? WHERE id = ?')
      .run(JSON.stringify(found), xpReward, req.user.id);

    res.json({
      data: {
        new_egg: true,
        egg_id,
        eggs: found,
        xp_earned: xpReward,
        xp: user.xp_points + xpReward,
      }
    });
  } catch (err) {
    console.error('Easter egg error:', err);
    res.status(500).json({ error: 'Failed to save easter egg.' });
  }
});

// POST /api/users/referral - generate referral link (just return existing code)
router.get('/referral', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT referral_code FROM users WHERE id = ?').get(req.user.id);
    const referrals = db.prepare("SELECT COUNT(*) as count FROM referrals WHERE referrer_id = ? AND status = 'completed'").get(req.user.id);
    res.json({ data: { referral_code: user.referral_code, referrals_count: referrals.count } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get referral info.' });
  }
});

module.exports = router;
