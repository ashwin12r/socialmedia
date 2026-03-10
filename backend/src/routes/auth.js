const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');
const { generateToken } = require('../middleware/auth');

// Generate a unique referral code
function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'ETECH-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, referral_code } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 12);
    const myReferralCode = generateReferralCode();

    // Handle referral
    let referred_by = null;
    if (referral_code) {
      const referrer = db.prepare('SELECT id FROM users WHERE referral_code = ?').get(referral_code);
      if (referrer) {
        referred_by = referrer.id;
        // Update referral record
        db.prepare(`UPDATE referrals SET referred_user_id = ?, status = 'completed' WHERE referrer_id = ? AND status = 'pending' AND referred_email IS NULL LIMIT 1`).run(id, referrer.id);
        // Give XP to referrer
        db.prepare('UPDATE users SET xp_points = xp_points + 50 WHERE id = ?').run(referrer.id);
        // Create referral record
        db.prepare('INSERT INTO referrals (id, referrer_id, referred_user_id, status) VALUES (?, ?, ?, ?)').run(uuidv4(), referrer.id, id, 'completed');
      }
    }

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, referral_code, referred_by, xp_points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, password_hash, myReferralCode, referred_by, referred_by ? 25 : 0);

    const user = db.prepare('SELECT id, name, email, avatar_url, bio, year_of_study, department, referral_code, profile_completed, easter_eggs_found, xp_points, created_at FROM users WHERE id = ?').get(id);
    user.easter_eggs_found = JSON.parse(user.easter_eggs_found || '[]');

    const token = generateToken(user);

    res.status(201).json({ data: { user, token } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Remove sensitive data
    delete user.password_hash;
    user.easter_eggs_found = JSON.parse(user.easter_eggs_found || '[]');

    const token = generateToken(user);

    res.json({ data: { user, token } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;
