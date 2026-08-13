require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-seed the database on boot if it's empty (e.g. after a fresh/ephemeral disk)
const db = require('./models/database');
const clubCount = db.prepare('SELECT COUNT(*) as count FROM clubs').get().count;
if (clubCount === 0) {
  console.log('📦 Empty database detected — seeding initial data...');
  require('./seeds/seed');
}

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/members', require('./routes/members'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/social-posts', require('./routes/socialPosts'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/department', require('./routes/department'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 E-Tech Social Club API running on port ${PORT}`);
});
