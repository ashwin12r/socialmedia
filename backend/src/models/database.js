const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '..', process.env.DATABASE_PATH || './database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    color TEXT DEFAULT '#6366f1',
    icon TEXT DEFAULT 'Users',
    activities TEXT,
    social_links TEXT DEFAULT '{}',
    member_count INTEGER DEFAULT 0,
    founded_year INTEGER,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    club_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Member',
    title TEXT,
    bio TEXT,
    avatar_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    instagram_url TEXT,
    year_of_study TEXT,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tag TEXT DEFAULT 'General',
    club_id TEXT,
    is_pinned INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    published_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    club_id TEXT,
    category TEXT DEFAULT 'Department',
    date TEXT,
    image_url TEXT,
    proof_url TEXT,
    is_featured INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    club_id TEXT,
    event_name TEXT,
    category TEXT DEFAULT 'General',
    year INTEGER,
    is_published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'technical',
    category TEXT,
    club_id TEXT,
    date TEXT,
    location TEXT,
    image_url TEXT,
    is_published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    post_url TEXT,
    embed_html TEXT,
    caption TEXT,
    image_url TEXT,
    club_id TEXT,
    posted_at TEXT DEFAULT (datetime('now')),
    is_published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS achievement_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    club_id TEXT,
    club_name TEXT,
    title TEXT NOT NULL,
    description TEXT,
    proof_url TEXT,
    proof_image_url TEXT,
    status TEXT DEFAULT 'pending',
    reviewer_notes TEXT,
    submitted_at TEXT DEFAULT (datetime('now')),
    reviewed_at TEXT,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS department_info (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT DEFAULT 'E-Tech Department',
    description TEXT,
    vision TEXT,
    mission TEXT,
    highlights TEXT DEFAULT '[]',
    stats TEXT DEFAULT '{}',
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    year_of_study TEXT,
    department TEXT DEFAULT 'E-Tech',
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    profile_completed INTEGER DEFAULT 0,
    easter_eggs_found TEXT DEFAULT '[]',
    xp_points INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    referrer_id TEXT NOT NULL,
    referred_email TEXT,
    referred_user_id TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
