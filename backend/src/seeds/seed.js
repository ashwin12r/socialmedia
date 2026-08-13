const db = require('../models/database');
const { v4: uuidv4 } = require('uuid');

console.log('🌱 Seeding database...');

// Clear existing data
db.exec('DELETE FROM social_posts');
db.exec('DELETE FROM gallery');
db.exec('DELETE FROM activities');
db.exec('DELETE FROM achievements');
db.exec('DELETE FROM announcements');
db.exec('DELETE FROM members');
db.exec('DELETE FROM achievement_submissions');
db.exec('DELETE FROM clubs');
db.exec('DELETE FROM department_info');

// ─── Department Info ───
db.prepare(`INSERT INTO department_info (id, name, description, vision, mission, highlights, stats) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
  'main',
  'E-Tech Department',
  'The Electronics & Technology Department is a hub of innovation, creativity, and technical excellence. Our department bridges the gap between theoretical knowledge and practical application, nurturing the next generation of tech leaders.',
  'To be a globally recognized center of excellence in electronics and technology education, fostering innovation and producing industry-ready professionals who drive technological advancement.',
  'To provide a dynamic and inclusive learning environment that empowers students with cutting-edge knowledge, hands-on experience, and leadership skills through academics, research, and vibrant club activities.',
  JSON.stringify([
    'State-of-the-art laboratories and research facilities',
    'Industry partnerships with leading tech companies',
    'Award-winning student clubs and technical teams',
    '100% placement assistance with top recruiters',
    'Regular workshops, hackathons, and tech fests',
    'Strong alumni network across the globe'
  ]),
  JSON.stringify({ students: 850, faculty: 45, labs: 12, publications: 200, placements_percent: 95 })
);

// ─── Clubs ───
const clubs = [
  { id: 'club-smc', name: 'Social Media Club', slug: 'social-media-club', tagline: 'Amplifying voices, building brands, creating impact', description: 'The Social Media Club is the creative heartbeat of the E-Tech Department. We manage the department\'s digital presence, create engaging content, and build a vibrant online community. From graphic design to video production, content strategy to analytics — we do it all.', color: '#ec4899', icon: 'Share2', member_count: 25, founded_year: 2021, activities: 'Content Creation, Social Media Management, Graphic Design, Video Production, Brand Strategy, Digital Marketing Workshops' },
  { id: 'club-coding', name: 'CodeCraft Club', slug: 'codecraft-club', tagline: 'Code. Create. Conquer.', description: 'CodeCraft is where algorithms come alive. From competitive programming to full-stack development, we nurture coders who can tackle any challenge. Weekly contests, mentoring sessions, and group projects keep our members sharp and industry-ready.', color: '#6366f1', icon: 'Code', member_count: 60, founded_year: 2019, activities: 'Competitive Programming, Hackathons, Code Reviews, DSA Workshops, Project Development, Tech Talks' },
  { id: 'club-robotics', name: 'RoboTech Club', slug: 'robotech-club', tagline: 'Engineering the future, one robot at a time', description: 'RoboTech brings together passionate engineers who design, build, and program robots. From autonomous drones to IoT devices, our projects push the boundaries of what\'s possible with electronics and embedded systems.', color: '#f59e0b', icon: 'Cpu', member_count: 35, founded_year: 2018, activities: 'Robot Design, IoT Projects, Arduino/Raspberry Pi Workshops, Drone Building, National Competitions, Exhibition Events' },
  { id: 'club-cyber', name: 'CyberShield Club', slug: 'cybershield-club', tagline: 'Defend. Detect. Dominate.', description: 'CyberShield is dedicated to cybersecurity education and practice. We explore ethical hacking, network security, cryptography, and digital forensics. Our CTF teams regularly compete in national and international competitions.', color: '#10b981', icon: 'Shield', member_count: 30, founded_year: 2020, activities: 'CTF Competitions, Ethical Hacking Workshops, Security Audits, Cryptography Sessions, Bug Bounty Practice, Awareness Campaigns' },
  { id: 'club-ai', name: 'AI/ML Society', slug: 'ai-ml-society', tagline: 'Intelligence amplified', description: 'The AI/ML Society explores the frontiers of artificial intelligence and machine learning. From neural networks to natural language processing, we build projects that leverage data to create intelligent solutions.', color: '#8b5cf6', icon: 'Brain', member_count: 40, founded_year: 2020, activities: 'ML Workshops, Data Science Projects, Kaggle Competitions, Research Paper Discussions, AI Ethics Debates, Industry Expert Talks' },
  { id: 'club-design', name: 'DesignX Studio', slug: 'designx-studio', tagline: 'Where pixels meet purpose', description: 'DesignX Studio is the creative powerhouse of the department. We focus on UI/UX design, graphic design, motion graphics, and 3D visualization. Our members create stunning visuals for department events, publications, and digital platforms.', color: '#f43f5e', icon: 'Palette', member_count: 20, founded_year: 2022, activities: 'UI/UX Design, Graphic Design Workshops, Design Sprints, Portfolio Reviews, Tool Mastery Sessions, Design Challenges' },
];

const insertClub = db.prepare(`INSERT INTO clubs (id, name, slug, tagline, description, color, icon, member_count, founded_year, activities, social_links, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
clubs.forEach((c, i) => {
  insertClub.run(c.id, c.name, c.slug, c.tagline, c.description, c.color, c.icon, c.member_count, c.founded_year, c.activities, JSON.stringify({ instagram: '#', twitter: '#', linkedin: '#', youtube: '#' }), i);
});

// ─── Members (Social Media Club) ───
const smcMembers = [
  { name: 'Arjun Mehta', role: 'Lead', title: 'Club President', bio: 'Passionate about digital storytelling and brand building. Leading the SMC to new heights.', year: '4th Year' },
  { name: 'Priya Sharma', role: 'Co-Lead', title: 'Vice President', bio: 'Content strategist with an eye for design. Making every post count.', year: '3rd Year' },
  { name: 'Rahul Verma', role: 'Co-Lead', title: 'Creative Director', bio: 'Graphic design wizard. Turning ideas into visual masterpieces.', year: '3rd Year' },
  { name: 'Sneha Patel', role: 'Member', title: 'Video Editor', bio: 'Cinematic storytelling through compelling video content.', year: '2nd Year' },
  { name: 'Vikram Singh', role: 'Member', title: 'Content Writer', bio: 'Words that engage, inform, and inspire our community.', year: '2nd Year' },
  { name: 'Ananya Gupta', role: 'Member', title: 'Social Media Manager', bio: 'Managing our digital presence across all platforms.', year: '3rd Year' },
  { name: 'Karthik Raj', role: 'Member', title: 'Photographer', bio: 'Capturing moments that tell the story of our department.', year: '2nd Year' },
  { name: 'Divya Nair', role: 'Member', title: 'Analytics Lead', bio: 'Data-driven decisions for maximum social impact.', year: '3rd Year' },
];

const insertMember = db.prepare('INSERT INTO members (id, club_id, name, role, title, bio, year_of_study, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
smcMembers.forEach((m, i) => {
  insertMember.run(uuidv4(), 'club-smc', m.name, m.role, m.title, m.bio, m.year, i);
});

// Add some members to other clubs too
const otherMembers = [
  { club: 'club-coding', name: 'Aditya Kumar', role: 'Lead', title: 'President', bio: 'Full-stack developer and competitive programmer.' },
  { club: 'club-coding', name: 'Meera Joshi', role: 'Co-Lead', title: 'VP - Competitions', bio: 'Codeforces Expert. Love algorithmic challenges.' },
  { club: 'club-robotics', name: 'Sanjay Reddy', role: 'Lead', title: 'President', bio: 'Embedded systems enthusiast and robotics engineer.' },
  { club: 'club-robotics', name: 'Nisha Iyer', role: 'Co-Lead', title: 'VP - Hardware', bio: 'PCB design specialist and Arduino guru.' },
  { club: 'club-cyber', name: 'Rohan Das', role: 'Lead', title: 'President', bio: 'Ethical hacker and CTF champion.' },
  { club: 'club-ai', name: 'Kavya Menon', role: 'Lead', title: 'President', bio: 'ML researcher focused on computer vision.' },
  { club: 'club-design', name: 'Ishaan Malik', role: 'Lead', title: 'President', bio: 'UI/UX designer passionate about accessible design.' },
];
otherMembers.forEach((m, i) => {
  insertMember.run(uuidv4(), m.club, m.name, m.role, m.title, m.bio, '3rd Year', i);
});

// ─── Announcements ───
const announcements = [
  { title: 'TechFest 2026 Registration Open!', content: 'The biggest technical festival of the year is here! Register now for hackathons, workshops, and exciting competitions. Early bird discounts available until March 10th. Don\'t miss out on this incredible opportunity to showcase your skills!', tag: 'Important', is_pinned: 1, club_id: null },
  { title: 'CodeCraft Weekly Contest #42', content: 'This week\'s contest focuses on Dynamic Programming and Graph Algorithms. Join us this Saturday at 3 PM in Lab 204. Prizes for top 3 finishers! All skill levels welcome.', tag: 'Event', is_pinned: 0, club_id: 'club-coding' },
  { title: 'New AI/ML Workshop Series', content: 'Excited to announce a 4-week workshop series on Deep Learning with PyTorch! Starting next Monday. Topics include CNNs, RNNs, GANs, and Transformers. Limited seats — register on the portal now.', tag: 'Event', is_pinned: 0, club_id: 'club-ai' },
  { title: 'Department Placement Drive 2026', content: 'Top tech companies including Google, Microsoft, and Amazon will be visiting our campus for the annual placement drive. Prepare with our mock interview sessions starting next week.', tag: 'Important', is_pinned: 1, club_id: null },
  { title: 'RoboTech Exhibition Day', content: 'Come witness the amazing robots built by our students! The annual RoboTech Exhibition will be held in the Main Auditorium on March 15th. Live demonstrations and interactive sessions included.', tag: 'Event', is_pinned: 0, club_id: 'club-robotics' },
  { title: 'Social Media Club Recruitment', content: 'We\'re looking for creative minds to join our team! If you\'re passionate about content creation, design, video editing, or social media strategy, apply now. Open to all years.', tag: 'General', is_pinned: 0, club_id: 'club-smc' },
  { title: 'CyberShield CTF Competition Results', content: 'Congratulations to our CyberShield team for securing 2nd place at the National CTF Championship! Special mentions to Rohan Das and team for their incredible performance.', tag: 'General', is_pinned: 0, club_id: 'club-cyber' },
  { title: 'Design Sprint Challenge', content: 'DesignX Studio presents a 48-hour design sprint! Theme: "Sustainable Campus Technology". Form teams of 2-4 and register at the design studio. Amazing prizes and mentorship opportunities await!', tag: 'Event', is_pinned: 0, club_id: 'club-design' },
];

const insertAnnouncement = db.prepare('INSERT INTO announcements (id, title, content, tag, club_id, is_pinned, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
announcements.forEach((a, i) => {
  const daysAgo = i * 3;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  insertAnnouncement.run(uuidv4(), a.title, a.content, a.tag, a.club_id, a.is_pinned, date.toISOString());
});

// ─── Achievements ───
const achievements = [
  { title: 'National Hackathon Champions 2025', description: 'CodeCraft team won first place at the National Level Hackathon organized by IIT Bombay, competing against 500+ teams from across the country.', club_id: 'club-coding', category: 'Club', date: '2025-11-15', is_featured: 1 },
  { title: 'Best Department Website Award', description: 'Our department website won the "Best Academic Website" award at the Inter-College Web Design Competition.', club_id: 'club-smc', category: 'Club', date: '2025-10-20', is_featured: 1 },
  { title: 'RoboWars National Finalist', description: 'RoboTech\'s combat robot "Thunderstrike" reached the national finals of RoboWars 2025, placing in the top 5.', club_id: 'club-robotics', category: 'Club', date: '2025-09-10', is_featured: 1 },
  { title: 'CTF National Championship - 2nd Place', description: 'CyberShield team secured 2nd position at the National CTF Championship, solving 95% of all challenges.', club_id: 'club-cyber', category: 'Club', date: '2025-08-22', is_featured: 1 },
  { title: 'Research Paper Published in IEEE', description: 'AI/ML Society members published a research paper on "Efficient Transformer Architectures" in IEEE Transactions.', club_id: 'club-ai', category: 'Club', date: '2025-07-15', is_featured: 0 },
  { title: 'Department Ranked #1 in University', description: 'The E-Tech Department achieved the highest ranking among all departments in the university\'s annual assessment.', club_id: null, category: 'Department', date: '2025-12-01', is_featured: 1 },
  { title: '95% Placement Rate Achieved', description: 'Our students achieved the highest placement rate in the college with offers from Google, Microsoft, Amazon, and more.', club_id: null, category: 'Department', date: '2025-06-30', is_featured: 1 },
  { title: 'Smart India Hackathon Winners', description: 'A cross-club team won the Smart India Hackathon 2025 with their IoT-based smart campus solution.', club_id: null, category: 'Department', date: '2025-05-20', is_featured: 1 },
  { title: 'DesignX at Adobe Design Challenge', description: 'DesignX Studio reached the top 10 at the Adobe Creative Challenge national competition.', club_id: 'club-design', category: 'Club', date: '2025-04-10', is_featured: 0 },
  { title: 'International Conference Presentation', description: 'Department faculty and students presented 5 papers at the International Conference on Emerging Technologies.', club_id: null, category: 'Department', date: '2025-03-15', is_featured: 0 },
];

const insertAchievement = db.prepare('INSERT INTO achievements (id, title, description, club_id, category, date, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
achievements.forEach((a, i) => {
  insertAchievement.run(uuidv4(), a.title, a.description, a.club_id, a.category, a.date, a.is_featured ? 1 : 0, i);
});

// ─── Activities ───
const activities = [
  { title: 'Web Development Bootcamp', description: 'Intensive 3-day bootcamp covering HTML, CSS, JavaScript, React, and Node.js. Build a complete project from scratch.', type: 'technical', category: 'Workshop', club_id: 'club-coding', date: '2026-03-05', location: 'Lab 301' },
  { title: 'Hackathon: Code for Good', description: '24-hour hackathon focused on building solutions for social impact. Open to all departments.', type: 'technical', category: 'Hackathon', club_id: 'club-coding', date: '2026-03-15', location: 'Main Auditorium' },
  { title: 'IoT Workshop with Raspberry Pi', description: 'Hands-on workshop on building IoT applications using Raspberry Pi. Sensors, actuators, and cloud connectivity.', type: 'technical', category: 'Workshop', club_id: 'club-robotics', date: '2026-02-28', location: 'Robotics Lab' },
  { title: 'Cybersecurity Awareness Week', description: 'Week-long event featuring talks, workshops, and CTF challenges on cybersecurity topics.', type: 'technical', category: 'Seminar', club_id: 'club-cyber', date: '2026-03-10', location: 'Seminar Hall' },
  { title: 'ML Paper Reading Group', description: 'Weekly sessions discussing cutting-edge machine learning research papers. This week: Vision Transformers.', type: 'technical', category: 'Seminar', club_id: 'club-ai', date: '2026-02-20', location: 'AI Lab' },
  { title: 'UI/UX Design Thinking Workshop', description: 'Learn the design thinking process: Empathize, Define, Ideate, Prototype, and Test.', type: 'technical', category: 'Workshop', club_id: 'club-design', date: '2026-03-01', location: 'Design Studio' },
  { title: 'Annual Cultural Fest - TechRhythm', description: 'The department\'s cultural extravaganza featuring music, dance, art, and tech-themed performances.', type: 'non-technical', category: 'Cultural', club_id: null, date: '2026-04-10', location: 'Open Air Theatre' },
  { title: 'Photography Walk', description: 'Explore the campus through your lens. Best photographs will be featured on the department social media.', type: 'non-technical', category: 'Creative', club_id: 'club-smc', date: '2026-03-08', location: 'Campus Wide' },
  { title: 'Public Speaking Workshop', description: 'Improve your communication and presentation skills with professional trainers and mock sessions.', type: 'non-technical', category: 'Skill Development', club_id: null, date: '2026-02-25', location: 'Seminar Hall B' },
  { title: 'Community Outreach: Teach Tech', description: 'Volunteer program to teach basic programming to underprivileged school students in nearby communities.', type: 'non-technical', category: 'Outreach', club_id: null, date: '2026-03-20', location: 'Community Center' },
  { title: 'Inter-Department Sports Tournament', description: 'Annual sports competition featuring cricket, basketball, badminton, and chess tournaments.', type: 'non-technical', category: 'Sports', club_id: null, date: '2026-04-05', location: 'Sports Complex' },
  { title: 'Alumni Talk: Life at Google', description: 'Our distinguished alumni shares their journey from college to Google and tips for aspiring engineers.', type: 'technical', category: 'Seminar', club_id: null, date: '2026-03-12', location: 'Main Auditorium' },
];

const insertActivity = db.prepare('INSERT INTO activities (id, title, description, type, category, club_id, date, location, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
activities.forEach((a, i) => {
  insertActivity.run(uuidv4(), a.title, a.description, a.type, a.category, a.club_id, a.date, a.location, i);
});

// ─── Gallery ───
const galleryItems = [
  { title: 'TechFest 2025 Opening Ceremony', event_name: 'TechFest 2025', category: 'Events', year: 2025, club_id: null, image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
  { title: 'Hackathon Winners Celebration', event_name: 'Hackathon 2025', category: 'Events', year: 2025, club_id: 'club-coding', image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' },
  { title: 'Robot Showcase Display', event_name: 'RoboExpo 2025', category: 'Exhibitions', year: 2025, club_id: 'club-robotics', image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800' },
  { title: 'AI Workshop Session', event_name: 'AI Week', category: 'Workshops', year: 2025, club_id: 'club-ai', image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' },
  { title: 'Design Sprint Team Collaboration', event_name: 'Design Sprint', category: 'Workshops', year: 2025, club_id: 'club-design', image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800' },
  { title: 'Cybersecurity CTF Competition', event_name: 'CTF Nationals', category: 'Competitions', year: 2025, club_id: 'club-cyber', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800' },
  { title: 'Social Media Club Photoshoot', event_name: 'Team Photoshoot', category: 'Team', year: 2025, club_id: 'club-smc', image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800' },
  { title: 'Annual Day Celebrations', event_name: 'Annual Day 2025', category: 'Events', year: 2025, club_id: null, image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800' },
  { title: 'Lab Innovation Project', event_name: 'Innovation Fair', category: 'Exhibitions', year: 2025, club_id: null, image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800' },
  { title: 'Guest Lecture Series', event_name: 'Expert Talks', category: 'Events', year: 2024, club_id: null, image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800' },
  { title: 'Coding Competition Participants', event_name: 'CodeWars 2024', category: 'Competitions', year: 2024, club_id: 'club-coding', image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' },
  { title: 'Department Sports Day', event_name: 'Sports Day 2024', category: 'Events', year: 2024, club_id: null, image_url: 'https://images.unsplash.com/photo-1461896836934-bd45ba8df9d7?w=800' },
];

const insertGallery = db.prepare('INSERT INTO gallery (id, title, image_url, club_id, event_name, category, year, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
galleryItems.forEach((g, i) => { insertGallery.run(uuidv4(), g.title, g.image_url, g.club_id, g.event_name, g.category, g.year, i); });

// ─── Social Posts ───
const socialPosts = [
  { platform: 'Instagram', caption: '🚀 TechFest 2026 is coming! Get ready for the biggest technical festival. Mark your calendars!', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', club_id: 'club-smc', post_url: '#' },
  { platform: 'Twitter', caption: '💻 Our CodeCraft team just won the National Hackathon! Incredible performances by all 6 team members. #ProudMoment', image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600', club_id: 'club-coding', post_url: '#' },
  { platform: 'LinkedIn', caption: '🎓 Placement season update: 95% of our students placed in top companies! Congratulations to the batch of 2025.', image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600', club_id: null, post_url: '#' },
  { platform: 'Instagram', caption: '🤖 Sneak peek at our latest robot build! RoboTech Club pushing boundaries as always. #Robotics #Innovation', image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600', club_id: 'club-robotics', post_url: '#' },
  { platform: 'Twitter', caption: '🛡️ CyberShield CTF team secures 2nd place at nationals! Proud of our security warriors. #Cybersecurity', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600', club_id: 'club-cyber', post_url: '#' },
  { platform: 'Instagram', caption: '🎨 Check out the amazing designs from our Design Sprint challenge! Creativity at its finest. #DesignThinking', image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600', club_id: 'club-design', post_url: '#' },
];

const insertPost = db.prepare('INSERT INTO social_posts (id, platform, post_url, caption, image_url, club_id, posted_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
socialPosts.forEach((p, i) => {
  const daysAgo = i * 2;
  const date = new Date(); date.setDate(date.getDate() - daysAgo);
  insertPost.run(uuidv4(), p.platform, p.post_url, p.caption, p.image_url, p.club_id, date.toISOString(), i);
});

console.log('✅ Database seeded successfully!');
console.log(`   Clubs: ${clubs.length}`);
console.log(`   Members: ${smcMembers.length + otherMembers.length}`);
console.log(`   Announcements: ${announcements.length}`);
console.log(`   Achievements: ${achievements.length}`);
console.log(`   Activities: ${activities.length}`);
console.log(`   Gallery Items: ${galleryItems.length}`);
console.log(`   Social Posts: ${socialPosts.length}`);

if (require.main === module) {
  process.exit(0);
}
