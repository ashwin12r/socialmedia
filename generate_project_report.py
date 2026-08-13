"""Generates Project_Overview.pdf documenting the E-Tech Social Hub website."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    ListFlowable, ListItem, HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

PRIMARY = colors.HexColor("#4F46E5")
DARK = colors.HexColor("#1F2937")
GRAY = colors.HexColor("#4B5563")
LIGHT_BG = colors.HexColor("#F3F4F6")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleBig", fontSize=26, leading=30, textColor=colors.white,
                           fontName="Helvetica-Bold", alignment=TA_LEFT))
styles.add(ParagraphStyle(name="SubtitleBig", fontSize=13, leading=18, textColor=colors.white,
                           fontName="Helvetica", alignment=TA_LEFT))
styles.add(ParagraphStyle(name="H1", fontSize=16, leading=20, textColor=PRIMARY,
                           fontName="Helvetica-Bold", spaceBefore=16, spaceAfter=8))
styles.add(ParagraphStyle(name="H2", fontSize=12, leading=16, textColor=DARK,
                           fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=4))
styles.add(ParagraphStyle(name="Body", fontSize=10, leading=15, textColor=GRAY,
                           fontName="Helvetica", spaceAfter=6))
styles.add(ParagraphStyle(name="BulletBody", fontSize=10, leading=14, textColor=GRAY,
                           fontName="Helvetica"))
styles.add(ParagraphStyle(name="Small", fontSize=8, leading=11, textColor=colors.HexColor("#9CA3AF")))

def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(i, styles["BulletBody"]), leftIndent=6, spaceAfter=3) for i in items],
        bulletType="bullet", start="•", leftIndent=14,
    )

def tech_table(rows, header):
    data = [header] + rows
    t = Table(data, colWidths=[45*mm, 125*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("TEXTCOLOR", (0, 1), (0, -1), DARK),
        ("TEXTCOLOR", (1, 1), (1, -1), GRAY),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t

def header_banner(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, A4[1] - 30*mm, A4[0], 30*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#9CA3AF"))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(20*mm, 10*mm, "E-Tech Social Hub — Project Overview")
    canvas.drawRightString(A4[0]-20*mm, 10*mm, f"Page {doc.page}")
    canvas.restoreState()

def first_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, A4[1] - 55*mm, A4[0], 55*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 28)
    canvas.drawString(20*mm, A4[1] - 30*mm, "E-Tech Social Hub")
    canvas.setFont("Helvetica", 13)
    canvas.drawString(20*mm, A4[1] - 40*mm, "Project Overview & Technology Report")
    canvas.setFillColor(colors.HexColor("#9CA3AF"))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(20*mm, 10*mm, "E-Tech Social Hub — Project Overview")
    canvas.drawRightString(A4[0]-20*mm, 10*mm, f"Page {doc.page}")
    canvas.restoreState()

story = []

# ---- Intro ----
story.append(Spacer(1, 20*mm))
story.append(Paragraph("What is this website?", styles["H1"]))
story.append(Paragraph(
    "<b>E-Tech Social Hub</b> is a full-stack web application built for an Electronics/Tech (E-Tech) "
    "department's social media club. It serves as a central hub for the department's various "
    "student clubs and communities — showcasing clubs, members, announcements, achievements, "
    "event activities, a photo gallery, and a live feed of social media posts. The site also "
    "includes user registration/login, a personal profile system, an achievement-submission workflow, "
    "and lightweight gamification (XP points, referral codes, and hidden \"easter eggs\") to encourage "
    "student engagement.", styles["Body"]))

story.append(Paragraph("Core Features", styles["H1"]))
story.append(bullets([
    "<b>Clubs directory</b> — browse all department clubs with dedicated profile pages (via dynamic <i>[slug]</i> routes).",
    "<b>Members</b> — club member listings with roles, bios, and social links (LinkedIn, GitHub, Instagram).",
    "<b>Announcements</b> — pinned/tagged department and club news feed.",
    "<b>Achievements</b> — a showcase of student/club accomplishments, plus a public submission form for students to nominate their own achievements for review.",
    "<b>Gallery</b> — event photo gallery with a lightbox viewer.",
    "<b>Activities</b> — listing of technical/social events by type, category, and date.",
    "<b>Social media feed</b> — embedded posts pulled from club social channels.",
    "<b>Authentication &amp; profile</b> — JWT-based sign up/login, editable user profile, referral codes.",
    "<b>Gamification</b> — XP points and hidden \"easter egg\" discoveries surfaced through a widget and a secret page.",
    "<b>Live stats</b> — animated counters for total clubs, members, events, and achievements pulled from the API.",
]))

# ---- Frontend ----
story.append(Paragraph("Frontend Technology", styles["H1"]))
story.append(Paragraph(
    "The frontend is a modern React application built with Next.js (App Router) and TypeScript, "
    "styled with Tailwind CSS and animated with Framer Motion.", styles["Body"]))
story.append(tech_table([
    ["Framework", "Next.js 16 (App Router, React Server/Client Components)"],
    ["UI Library", "React 19"],
    ["Language", "TypeScript"],
    ["Styling", "Tailwind CSS v4 (with PostCSS)"],
    ["Animation", "Framer Motion (page transitions, scroll reveals, floating elements)"],
    ["Data Fetching", "TanStack React Query (server-state caching) + Axios (HTTP client)"],
    ["Icons", "lucide-react"],
    ["Utilities", "clsx (conditional class names)"],
    ["Build/Compiler", "React Compiler (babel-plugin-react-compiler), ESLint 9"],
], ["Aspect", "Technology"]))

story.append(Paragraph("Frontend Structure", styles["H2"]))
story.append(bullets([
    "<b>src/app/</b> — route pages: home, about, clubs (+ dynamic club slug pages), members-facing achievements, "
    "announcements, activities, gallery, social-media-club, auth, profile, submit-achievement, and a secret/easter-egg page.",
    "<b>src/components/</b> — reusable UI: Navbar, Footer, ClubCard, MemberCard, SocialPostCard, AnimatedCounter, "
    "ParticleBackground, ScrollReveal, Lightbox, GamificationWidget, EasterEggManager, InteractiveCursor, ThemeProvider, LoadingSpinner.",
    "<b>src/lib/</b> — api.ts (Axios wrapper functions for backend endpoints) and auth.tsx (auth context/provider), providers.tsx (React Query provider setup).",
]))

story.append(PageBreak())

# ---- Backend ----
story.append(Paragraph("Backend Technology", styles["H1"]))
story.append(Paragraph(
    "The backend is a Node.js REST API built with Express, using SQLite as an embedded, file-based "
    "database — a lightweight choice well suited to a single-department club site.", styles["Body"]))
story.append(tech_table([
    ["Runtime", "Node.js"],
    ["Web Framework", "Express 4"],
    ["Database", "SQLite via better-sqlite3 (WAL journal mode, foreign keys enabled)"],
    ["Authentication", "JSON Web Tokens (jsonwebtoken) + bcryptjs password hashing"],
    ["Security Middleware", "Helmet (HTTP headers), CORS, express-rate-limit (200 req/15 min)"],
    ["File Uploads", "Multer (served statically from /uploads)"],
    ["Config", "dotenv (.env)"],
    ["IDs", "uuid"],
    ["Dev Tooling", "nodemon"],
], ["Aspect", "Technology"]))

story.append(Paragraph("Backend Structure", styles["H2"]))
story.append(bullets([
    "<b>src/server.js</b> — Express app setup: security middleware, rate limiting, static file serving, route mounting, error handling.",
    "<b>src/models/database.js</b> — SQLite schema definition/initialization (clubs, members, announcements, achievements, "
    "gallery, activities, social_posts, achievement_submissions, department_info, users, referrals).",
    "<b>src/routes/</b> — REST endpoints: auth, users, clubs, members, announcements, achievements, gallery, activities, "
    "socialPosts, submissions, department, stats.",
    "<b>src/middleware/auth.js</b> — JWT verification middleware for protected routes.",
    "<b>src/seeds/seed.js</b> — database seeding script for initial demo data.",
]))

story.append(Paragraph("Database Schema (SQLite)", styles["H2"]))
story.append(bullets([
    "<b>clubs</b> — name, slug, tagline, description, branding (color/icon), social links, member count.",
    "<b>members</b> — per-club member profiles linked via club_id.",
    "<b>announcements</b> — title, content, tag, pinned/published flags, optional club association.",
    "<b>achievements</b> — title, description, category, proof/image URLs, featured flag.",
    "<b>achievement_submissions</b> — user-submitted achievements pending review (status: pending/approved/rejected).",
    "<b>gallery</b> — event photos with category/year metadata.",
    "<b>activities</b> — events with type/category/date/location.",
    "<b>social_posts</b> — embedded social media posts per platform.",
    "<b>department_info</b> — department-wide description, vision, mission, highlights, stats.",
    "<b>users</b> / <b>referrals</b> — accounts (with XP points, easter eggs found, referral codes) for auth and gamification.",
]))

# ---- Architecture ----
story.append(Paragraph("Architecture Summary", styles["H1"]))
story.append(Paragraph(
    "The project follows a classic decoupled client-server architecture: a Next.js frontend "
    "(deployed separately, e.g. on Vercel) communicates with an independent Express + SQLite "
    "REST API over HTTP (Axios/React Query), with CORS restricting access to the configured "
    "frontend origin and JWT securing authenticated endpoints.", styles["Body"]))

table = Table([
    ["Layer", "Technology Stack"],
    ["Frontend", "Next.js 16 + React 19 + TypeScript + Tailwind CSS + Framer Motion"],
    ["State/Data", "TanStack React Query + Axios"],
    ["Backend API", "Node.js + Express 4 + JWT Auth"],
    ["Database", "SQLite (better-sqlite3, WAL mode)"],
    ["Security", "Helmet, CORS, rate limiting, bcrypt password hashing"],
], colWidths=[40*mm, 130*mm])
table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), DARK),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 9.5),
    ("TEXTCOLOR", (0, 1), (0, -1), PRIMARY),
    ("TEXTCOLOR", (1, 1), (1, -1), GRAY),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(table)

story.append(Spacer(1, 10*mm))
story.append(HRFlowable(width="100%", color=colors.HexColor("#E5E7EB")))
story.append(Spacer(1, 3*mm))
story.append(Paragraph("Generated automatically from the project source code.", styles["Small"]))

doc = SimpleDocTemplate(
    "Project_Overview.pdf", pagesize=A4,
    leftMargin=20*mm, rightMargin=20*mm, topMargin=40*mm, bottomMargin=18*mm,
)
doc.build(story, onFirstPage=first_page, onLaterPages=header_banner)
print("PDF generated: Project_Overview.pdf")
